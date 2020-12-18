<template>
	<div class="container">
		<!-- 二级页面 （有返回按钮） -->
		<mHeader :title="title" class="m-header" :isBackShow="true"></mHeader>
		<div class="exam-warp">
			<div class="exam-name">{{ examInfo.examName }}</div>
			<div class="exam-legend">
				<div class="full">
					<span>{{ examInfo.totalScore }}</span>
					<span>满分</span>
				</div>
				<div class="success">
					<span>{{ examInfo.passScore }}</span>
					<span>合格</span>
				</div>
				<div class="page-number">
					<span>{{ examInfo.examQuestionLibEntityList.length }}</span>
					<span>题目总数</span>
				</div>
			</div>
			<div class="ask-exam-progress-warp">
				<div class="ask-exam-text">答题比例{{ percent }}%</div>
				<div class="progress-warp">
					<progress
						class="progress"
						:percent="percent" 
						activeColor="#008CD6"
						backgroundColor="#EFF2F5"
						stroke-width="4" 
						active="true"
						active-mode="forwards"
						border-radius="6"/>
					<span>{{ examInfo.examQuestionLibEntityList.length }}题</span>
				</div>
			</div>
			
			<!-- 单选题 -->
			<radioPage
				v-if="showPage.type === 1"
				:page="showPage"
				@answersRadio="answersRadio">
			</radioPage>
			<!-- 多选题 -->
			<checkPage
				v-else-if="showPage.type === 2"
				:page="showPage"
				@answersCheck="answersCheck">
			</checkPage>
			<!-- 判断题 -->
			<flagPage
				v-else-if="showPage.type === 3"
				:page="showPage"
				@answersFlag="answersFlag">
			</flagPage>
			
			<div class="footer">
				<div class="tool-btn-warp flex-between">
					<button 
						:class="{ 'disable' : nowPageNubmer <= 1 }"
						@click="prevPage">上一题</button>
					<button 
						:class="{ 'disable' : nowPageNubmer >= examInfo.examQuestionLibEntityList.length }"
						@click="nextPage">下一题</button>
				</div>
				<button 
					class="submit-warp flex-center"
					@click="submit">提交</button>
			</div>
		</div>
		
		<!-- 通过 -->
		<passExamModal 
			v-if="examStatus === 'pass'"
			@close="closeModal"
			:rate="rate"
			:planId="planId">
		</passExamModal>
		<!-- 未通过 -->
		<noPassExamModal 
			v-else-if="examStatus === 'noPass'"
			@close="closeModal"
			@reExam="reExam"
			:rate="rate">
		</noPassExamModal>
	</div>
</template>

<script>
	import mHeader from '../components/mHeader/index'
	import radioPage from './radioPage.vue'
	import checkPage from './checkPage.vue'
	import flagPage from './flagPage.vue'
	import passExamModal from './passExamModal.vue'
	import noPassExamModal from './noPassExamModal.vue'
	
	import Api from '../../api/api.js'
	
	import { mapState } from 'vuex'
	
	export default {
		data () {
			return {
				title: '考试',
				examInfo: {},
				percent: 0,
				showPage: {},
				nowPageNubmer: 1,
				examStatus: '',
				planId: '',
				planPeopleId: '',
				rate: ''
			}
		},
		components: {
			mHeader,
			radioPage,
			checkPage,
			flagPage,
			passExamModal,
			noPassExamModal
		},
		onLoad(options) {
			this.planId = options.planId
			this.planPeopleId = options.planPeopleId
			this._getExamInfo(this.planId)
		},
		computed: mapState({
		    askExamNum: 'askExamNum',
		}),
		watch: {
			askExamNum (newVal) {
				if (newVal === 10) {
					uni.showModal({
						title: '提示',
						content: '您已答题完毕，是否交卷',
						confirmText: '立即交卷',
						cancelText: '暂不交卷',
						success: (res) => {
							if (res.confirm) {
								this.submit()
							}
						},
						
					})
				}
			}
		},
		methods: {
			// 重新考试
			reExam () {
				this.examInfo.examQuestionLibEntityList.forEach(item => {
					item.answers = null
				})
				this.nowPageNubmer = 1
				this.$store.commit('SET_ASK_EXAM_NUM', 0)
				this.showPageFn()
				this.percentFn()
			},
			// 获取考试信息
			_getExamInfo (planId) {
				const params = {
					planId
				}
				Api.exam.getExamInfo(params).then(res => {
					this.examInfo = res.data
					this.$nextTick(() => {
						this.percentFn()
						this.showPageFn()
					})
				})
			},
			// 答题进度
			percentFn () {
				this.percent =  ( ( this.askExamNum / this.examInfo.examQuestionLibEntityList.length ) * 100).toFixed(0) || 0
			},
			// 保存答案
			answersSave (val) {
				const exam = this.examInfo.examQuestionLibEntityList
				let obj = {},
					askExamNum = 0
				obj = exam.filter((item, index) => index === this.nowPageNubmer - 1)[0]
				obj.answers = val
				this.examInfo.examQuestionLibEntityList[this.nowPageNubmer - 1] = obj
				
				askExamNum = exam.filter((item, index) => item.answers && item.answers.length ).length
				this.$store.commit('SET_ASK_EXAM_NUM', askExamNum)
				this.percentFn()
			},
			// 保存答案（单选）
			answersRadio (val) {
				this.answersSave(val)
			},
			// 保存答案（判断）
			answersFlag (val) {
				this.answersSave(val)
			},
			// 保存答案（多选）
			answersCheck (val) {
				this.answersSave(val)
			},
			// 选择显示题目
			showPageFn () {
				let obj = {}
				obj = this.examInfo.examQuestionLibEntityList.filter((item, index) => index === this.nowPageNubmer - 1)[0]
			
				if (typeof obj.options === 'string') {
					obj.options = JSON.parse(obj.options)
				}

				// 添加选择图片
				const type = obj.type
				if (type === 2) {
					obj.choiceImg = '../../static/images/study/square-chioce.png'
					obj.choiceImgActive = '../../static/images/study/square-chioce-active.png'
				} else {
					obj.choiceImg = '../../static/images/study/circular-choice.png'
					obj.choiceImgActive = '../../static/images/study/circular-choice-active.png'
				}
				
				this.showPage = obj
			},
			// 上一题
			prevPage () {
				if (this.nowPageNubmer <= 1) return
				this.nowPageNubmer--
				this.showPageFn()
			},
			// 下一题
			nextPage () {
				if (this.nowPageNubmer >= this.examInfo.examQuestionLibEntityList.length) return
				this.nowPageNubmer++
				this.showPageFn()
			},
			// 提交
			submit () {
				let examInfo = JSON.parse(JSON.stringify(this.examInfo))
				examInfo.examQuestionLibEntityList.forEach(item => {
					item.options = JSON.stringify(item.options)
					delete(item.choiceImg)
					delete(item.choiceImgActive)
					
					if (item.type === 2) {
						if (item.answers) {
							item.answers = JSON.stringify(item.answers)
						}
					}
				})
				
				const params = {
					planId: this.planId,
					planPeopleId: this.planPeopleId,
					...examInfo
				}
				
				Api.exam.commitPage(params).then(res => {
					const result = res.data.isPass
					this.rate = res.data.rate
					if (!result) {
						this.examStatus = 'pass'
					} else {
						this.examStatus = 'noPass'
					}
				})
			},
			// 关闭弹出层
			closeModal (val) {
				this.examStatus = val
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.m-header {
			background-color: #fff;
		}
		.exam-warp {
			min-height: 100vh;
			padding: calc(100rpx + 30rpx + var(--status-bar-height)) 32rpx 236rpx;
			box-sizing: border-box;
			.exam-name {
				font-size: 32rpx;
				font-weight: 500;
				color: $uni-text-color;
				margin-bottom: 20rpx;
			}
			.exam-legend {
				width: 100%;
				height: 220rpx;
				padding: 54rpx 32rpx 0;
				box-sizing: border-box;
				display: flex;
				background: #fff url(../../static/images/study/exam-legend-bg.png) no-repeat center/cover;
				box-shadow: 0 12rpx 24rpx 2rpx rgba(230,230,230,1);
				border-radius: 40rpx;
				> div {
					border-right: 2rpx solid $uni-bg-color-grey;
					display: flex;
					align-items: center;
					height: 70rpx;
					box-sizing: border-box;
					color: $uni-text-color;
					span {
						font-weight: 500;
						&:first-of-type {
							width: 70rpx;
							height: 70rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							border-radius: 10rpx;
							font-size: 32rpx;
						}
						&:last-of-type {
							margin-left: 16rpx;
							font-size: 28rpx;
						}
					}
				}
				.full {
					width: 196rpx;
					span {
						&:first-of-type {
							background-color: #D6F1F5;
							color: #34BACC;
						}
					}
				}
				.success {
					width: 198rpx;
					padding-left: 12rpx;
					span {
						&:first-of-type {
							background-color: #E1EFBE;
							color: #92AE47;
						}
					}
				}
				.page-number {
					width: 224rpx;
					padding-left: 24rpx;
					border-right: none;
					span {
						&:first-of-type {
							background-color: #FFEEE1;
							color: #E1843E;
						}
					}
				}
			}
			.ask-exam-progress-warp {
				margin: 32rpx 0 12rpx;
				.ask-exam-text {
					font-size: 22rpx;
					color: $uni-text-color-active;
				}
				.progress-warp {
					display: flex;
					.progress {
						flex: 1;
					}
					span {
						margin-left: 12rpx;
						font-size: 24rpx;
						color: $uni-text-color-active;
					}
				}
			}
			.footer {
				width: 100%;
				position: fixed;
				left: 0;
				bottom: 0;
				padding-bottom: 32rpx;
				background-color: #fff;
				box-sizing: border-box;
				.tool-btn-warp {
					margin-bottom: 28rpx;
					padding: 0 28rpx;
					button {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 280rpx;
						height: 88rpx;
						background: $uni-bg-color;
						border-radius: 45rpx;
						font-size: 32rpx;
						color: #fff;
						font-weight: 500;
						margin: 0;
						padding: 0;
					}
					.disable {
						background-color: $uni-bg-color-grey;
						color: $uni-text-color-grey;
					}
				}
				.submit-warp {
					width: calc(100% - 28rpx - 28rpx);
					height: 88rpx;
					background: $uni-bg-color;
					border-radius: 45rpx;
					font-size: 32rpx;
					color: #fff;
					font-weight: 500;
					margin: 0 auto;
					padding: 0;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
