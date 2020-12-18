<template>
	<view class="container">
	   <!-- 二级页面 （有返回按钮） -->
		<mHeader :title="title" class="m-header" :isBackShow="true"></mHeader>
		<view class="lesson-player">
			<div class="playBtn"  @tap="videoPlay" v-if="!playStatus"></div>
			<video id="myVideo" ref="myVideo" style="width: 100%;"
				   :src="'http://47.92.194.246:6661/biz/biz-system'+lessonDetail.path"
				   :autoplay="false"
				   :initial-time="lessonDetail.completedDuration"
				   :duration="lessonDetail.secondDuration"
				   :poster ="'http://47.92.194.246:6661/biz/biz-system'+ lessonDetail.coverPath"
				   :show-play-btn = "false"
				   :show-center-play-btn = "false"
				   :enable-progress-gesture="false"
				   :webkit-playsinline="true"
				   @play="triggerPlay"
				   @pause="triggerPause"
				   @bindended="videoPlayEnd"
				   @error="videoErrorCallback" 
				   @timeupdate="timeUpdate"
				   @ended="videoPlayEnd"
				   @tap="videoPlay">
			</video>
		</view>
		<view class="lesson-content">
			<!--进度条-->
			<view class="progress-box">
				<p class="progress-title">已学习{{lessonDetail.completionRate}}%</p>
				<view class="progress-bar flex-start">
					<progress class="progress" :percent="lessonDetail.completionRate"
					          border-radius="6" activeColor="#008CD6" backgroundColor="#EFF2F5"
					          stroke-width="4" active="true" active-mode="forwards"/> 
					<span class="progress-total">共{{ second2minute(lessonDetail.secondDuration)}}</span>
				</view>
			</view>
			<!--详细信息-->
			<view class="lesson-title">{{lessonDetail.name}}</view>
			<view class="lesson-title-content">{{lessonDetail.coursewareContent}}</view>
			<!--培训信息-->
			<view class="training-title">培训信息</view>
			<view class="tranning-card">
				<div class="flex-start ">
				   <div class="training-name">培训名称</div>
				   <div class="training-content">{{lessonDetail.planName}}</div>
				</div>
				<div class="flex-start ">
				   <div class="training-name" style="width:120rpx">组织部门</div>
				   <div class="training-content">{{lessonDetail.department}}</div>
				</div>
				<div class="flex-start ">
				   <div class="training-name">所属类型</div>
				   <div class="training-content">{{lessonDetail.typeName}}</div>
				</div>
				<div class="flex-start ">
				   <div class="training-name">培训形式</div>
				   <div class="training-content">{{lessonDetail.type === 1 ? '线上' : '线下'}}</div>
				</div>
				<div class="flex-start ">
				   <div class="training-name">培训课时</div>
				   <div class="training-content">{{lessonDetail.duration}}</div>
				</div>		  
				<div class="flex-start">
				   <div class="training-name" style="line-height: 14px;">培训时间</div>
				   <div class="training-content">
				    <p>{{lessonDetail.startTime}}</p>
					<p>{{lessonDetail.endTime}}</p>
				   </div>
				 </div>			  
				<div class="flex-start ">
				   <div class="training-name">培训状态</div>
				   <div class="training-content">
					   <span v-if="learnStatus === '0' ">待学习</span>
					   <span v-if="learnStatus === '1' ">学习中</span>
					   <span v-if="learnStatus === '2' ">已结束</span>
				   </div>
				 </div>
				<div class="flex-start">
					<div class="training-name">培训说明</div>
					<div class="training-content">{{lessonDetail.content}}</div>			  
				</div>
				<div class="flex-start">
					 <div class="training-name">是否需要考试</div>
					 <div class="training-content" style="margin-left: -27px;">{{lessonDetail.examFlag === 0? '否' : '是'}}</div>			  
				 </div>	
			</view>
		    <view class="exam-btn" v-if="lessonDetail.examFlag === 1">
				<div :class="{btn: true, btnActive: finished}"  @tap="jump2exam()">参加/继续考试</div>
			</view>
		</view>
		<!-- 通过 -->
		<learnDetailPopup  v-if="displayTip" :markedWords="markedWords" 
		                   @close="closeModal" @takeTest="jump2exam"></learnDetailPopup>
	</view>
</template>

<script>
	import mHeader from '../components/mHeader/index'
	import learnDetailPopup from './learnDetail-popup.vue'
	import Api from '../../api/api.js'
	import {formatSeconds} from '../../libs/replace.js'
	export default {
	    data() {
	        return {
				title: '学习详情',
				videoContext: null, // 播放器内容
				intervalId: null, // 上报定时器
				lessonDetail: {
					planName: '', // 培训名称,
					duration: '', // 课时,
					secondDuration: '', // 视频时长(单位: 秒)
					coverPath: '', // 封面地址 需拼接
					result: '', // 是否合格(0.未考试 1.合格 2.不合格)
					completionRate: 0,// "视频学习进度",
					completedDuration: 0, // "已学时长",单位是秒吗？
					planId: '', // a983257d6b5caeb5b3e204503aac4e8a
					examFlag: 1, // 是否需要考试 0-否 1-是
					content: '', // 培训说明
					department: "组织部门",
					typeName: "所属类型",
					type: 1, // 培训形式 1-线上 2-线下
					startTime: '', // 培训开始时间
					endTime: "培训结束时间",
					name: "课件标题",
					coursewareContent: "课件内容",
					examId: '', // 试卷ID
					planPeopleId: ''
				},
				learnStatus: 0,
				playStatus: false,
				completedDuration: 0, // 已学时长
				reportParams: {
					planId:'',
					totalDuration: '',
					completedDuration:''
				},
	            src: '',
	            displayTip: false,
				markedWords: {
				   words: '',
				   type: 0 // type=0:20分钟是否继续学习，type = 1：不能快进， type =2： 学习完是否考试
				},
				finished: false,
				banFastForward: false
	        }
	    },
		components: {
			mHeader, learnDetailPopup
		},
		created(){
			
		},
		mounted () {
		},
	    onReady: function(res) {
	        this.videoContext = uni.createVideoContext('myVideo')
			console.log('this.videoContext', this.videoContext)
	    },
		onLoad: function(options) {
			this.getStudyDetail(options.planId)
			this.learnStatus = options.status
		},
		onShow: function() {
		},
		onHide: function() {
		  this.reportPlayProgress()
		},
		watch: {
		  playStatus(val, oldVal){ 
		    if (val) {
			  let _this = this
			  this.intervalId = setInterval(function () {
			    _this.reportPlayProgress()
			  }, 1000 * 60)
			} else {
			  clearInterval(this.intervalId)
			}
		  }
		},
	    methods: {
			// 获取学习详情
			getStudyDetail (param) {
			   Api.study.getTrainplanDetail({planId: param}).then(res => {
			   	console.log('学习详情',res)
			   	if(res.code === 1){
			   	  this.lessonDetail = res.data
				  this.reportParams.completedDuration  = res.data.completedDuration
				  this.banFastForward = true
				  if(res.data.completionRate === 100){
					this.finished = true  
				  }
			   	} else {
			   	  uni.showToast({
			   	      title: '获取学习详情失败',
			   	      duration: 1500
			   	  })
			   	}
			   })
			},
			// 跳转到考试页面
			jump2exam () {
			  if (!this.finished) return
			  uni.navigateTo({
			      url: '/pages/exam/index?planId='+ this.lessonDetail.planId + "&planPeopleId=" + this.lessonDetail.planPeopleId
			  })
			},
			// 观看二十分钟提示
			watchPrompt(){
				if (!that.displayTip) {
				  that.displayTip = true
				  that.markedWords.words= '您已学习10分钟，是否继续学习?'
				  that.markedWords.type= 0
				}
			},
			// 播放器，播放/暂停
			videoPlay () {
				if(this.playStatus){
					this.videoContext.pause()
					this.playStatus = false
					this.reportPlayProgress()
				} else {
					this.videoContext.play()
					this.playStatus = true
				}
			},
			// 触发视频播放
			triggerPlay () {
				this.playStatus = true
			},
			// 触发暂停
			triggerPause () {
				this.playStatus = false
			},
			// 学习视频播放完毕
			videoPlayEnd(){
				console.log('学习完毕', this.displayTip)
				if (!this.displayTip) {
				  this.displayTip = true
				  this.markedWords.words= '您已学习完成，是否参加考试?'
				  this.markedWords.type= 2
				}
				this.reportPlayProgress()
				this.finished = true
			},
			// 关闭弹出层
			closeModal (val) {
			  console.log('val',val)
			  this.displayTip = false
			},
			// 禁止快进
			timeUpdate: function (e) {
                if(!this.banFastForward) return
				let currentTime = parseInt(e.detail.currentTime) //实时播放进度秒数
				// console.log("视频播放到第" + currentTime + "秒") // 查看正在播放时间，以秒为单位
                // 不能快进
			    if ( currentTime > this.lessonDetail.completedDuration && currentTime - this.reportParams.completedDuration > 2){
					this.videoContext.seek(this.reportParams.completedDuration)
					this.displayTip = true // 弹框提醒不能快进
					this.markedWords.words= '您还有内容未学习，不能快进到这里学习'
					this.markedWords.type= 1
				  }
				this.reportParams.completedDuration = currentTime // 正在播放时间--上报接口参数
				if (currentTime === 60*10 ) { // 观看20分钟提醒
					this.watchPrompt()
				}
			},
			// 上报播放进度
			reportPlayProgress () {
				this.reportParams.planId = this.lessonDetail.planId
				this.reportParams.totalDuration = this.lessonDetail.secondDuration
				Api.study.trainplanReport(this.reportParams).then(res => {
					console.log('上报学习进度',res)
					if(res.code === 1){
					  this.getLatestProgress()
					}
				})
			},
			// 获取最新进度
			getLatestProgress () {
				Api.study.trainGetProgress({'planPeopleId': this.lessonDetail.planPeopleId}).then(res => {
					console.log('获取最新学习进度',res)
					// 返回数据 totalDuration 视频总时长  completedDuration 已学市场  completionRate 学习进度
					if(res.code === 1){
					  this.lessonDetail.completionRate = res.data.completionRate
					}
				})
			},
			// 时间转化
			second2minute(item){
			  return formatSeconds(item)
			},
			// 
	        videoErrorCallback: function(e) {
	            uni.showModal({
	                content: e.target.errMsg,
	                showCancel: false
	            })
	        },
	    }
	}
</script>

<style lang="scss" scoped>
	.container {
		.m-header {
			background-color: #fff;
		}
	}
	.lesson-player{
		padding-top: calc(100rpx + 30rpx + var(--status-bar-height));
		width: 100%;
		position: relative;
		video{
		  height: 422rpx;
		}
		.playBtn{
			background-image: url("../../static/images/common/play-btn@2x.png");
			background-size: 100%;
			background-repeat: no-repeat;
			background-position: 50% 50%;
		    cursor: pointer;
		    position: absolute;
		    left: 40%;
		    top: 45%;
		    width: 174rpx;
		    height: 174rpx;
		    z-index: 100;
		}
    }
	.lesson-content{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		margin: 0rpx 32rpx 0rpx 32rpx;
	  .progress-box{
		  margin: 6rpx 0rpx 12rpx 0rpx;
		.progress-title{
			height: 32rpx;
			font-size: 22rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #008CD6;
			line-height: 32rpx;
		}
		.progress-bar{
			.progress {
				flex: 1;
			}
			span {
				margin-left: 12rpx;
				font-size: 24rpx;
				color: $uni-text-color-active;
				height: 34rpx;
				font-size: 24rpx;
				font-family: PingFangHK-Medium, PingFangHK;
				font-weight: 500;
				color: #008CD6;
				line-height: 34rpx;
			}
		}
	  }
	  .lesson-title{
		  height: 48rpx;
		  font-size: 28rpx;
		  font-family: PingFangSC-Medium, PingFang SC;
		  font-weight: 500;
		  color: #1C2F54;
		  line-height: 48rpx;
	  }
	  .lesson-title-content{
		 font-size: 28rpx;
		 font-family: PingFangSC-Light, PingFang SC;
		 font-weight: 300;
		 color: #1C2F54;
		 line-height: 60rpx;
	  }
	  .training-title{
		  font-size: 32rpx;
		  font-family: PingFangSC-Medium, PingFang SC;
		  font-weight: 500;
		  color: $uni-text-color;
		  line-height: 44rpx;
		  // -webkit-text-stroke: 1px #979797;
		  text-stroke: 2rpx #979797;
		  height: 68rpx;
		  line-height: 60rpx;
		  display: flex;
		  flex-direction: column;
		  justify-content: flex-start;
		 &:after{
		 	content: " ";
		    width: 60rpx;
		    height: 8rpx;
			border-radius: 8rpx;
		    background-color: $uni-text-color-active;
		 }
	  }

	  .tranning-card{
		  width: 686rpx;
		  background: #FFFFFF;
		  box-shadow: 0 12rpx 24rpx 2rpx #F0F0F0;
		  border-radius: 20rpx;
		  padding-bottom: 20rpx;
		  padding-top: 20rpx;
		  .training-name{
			  height: 60rpx;
			  font-size: 28rpx;
			  font-family: PingFangSC-Regular, PingFang SC;
			  font-weight: 400;
			  color: #738296;
			  line-height: 68rpx;
			  margin-right: 70rpx;
			  margin-left: 20rpx;
		  }
		  .training-name:last-child{
		     margin-right: 24rpx;
		  }
		  .training-content{
		    font-size: 28rpx;
		    font-family: PingFangSC-Regular, PingFang SC;
		    font-weight: 400;
		    color: #1C2F54;
		    line-height: 68rpx;
		 }
	  }
	  .exam-btn{
		  width: 100%;
		  margin-top: 40rpx;
		  margin-bottom: 24rpx;
		  .btn{
			  margin: 0 auto;
			  width: 630rpx;
			  height: 88rpx;
			  background-color: #d3d3d3; 
			  border-radius: 44rpx;
			  text-align: center;/*让文字水平居中*/
			  font-size: 32rpx;
			  font-family: PingFangSC-Medium, PingFang SC;
			  font-weight: 500;
			  color: $uni-text-color-btn;
			  line-height: 88rpx;
		  }
		  .btnActive {
			background: $uni-border-color !important;
		  }
	  }
	}
    /deep/.uni-video-cover-play-button {
		    width: 80px;
		    height: 80px;
		    cursor: pointer;
			background-image: url("../../static/images/common/play-btn@2x.png");
			background-size: 100%;
			background-repeat: no-repeat;
			background-position: 50% 50%;
	}
	.uni-video-cover-play-button {
		    width: 80px;
		    height: 80px;
		    cursor: pointer;
			background-image: url("../../static/images/common/play-btn@2x.png");
			background-size: 100%;
			background-repeat: no-repeat;
			background-position: 50% 50%;
	}
	/deep/.uni-video-cover-duration {
		display: none;
	}
	.uni-video-cover-duration {
		display: none;
	}
</style>
