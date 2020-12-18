<template>
	<div class="container">
		<!-- 二级页面 （有返回按钮） -->
		<mHeader :title="title" class="m-header" :isBackShow="true"></mHeader>
		<div class="list-warp">
			<div class="list"
				v-for="(item, index) in medalBook"
				:key="index">
				<p class="name">{{ item.planName }}</p>
				<div class="tab-warp">
					<div class="medal-book">
						<div class="content">
							<div class="txt">
学员  {{ item.name }}，单位  {{ item.orgName }}，参加并完成{{ item.startTime }}至{{item.endTime}}{{ item.planName }}培训课程，成绩合格，特颁此证。
							</div>
							<div class="footer">
								<div>{{ item.department }}</div>
								<div>{{ item.examTime }}</div>
							</div>
						</div>
						<image src="../../static/images/my/my-medal-book.png"></image>
					</div>
					<button class="look-medal-book">查看证书</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import mHeader from '../components/mHeader/index'
	import Api from '../../api/api.js'
	export default {
		data () {
			return {
				title: '我的证书',
				medalBook: []
			}
		},
		components: {
			mHeader
		},
		created() {
			this._getMyMedalBook()
		},
		methods: {
			// 获取荣誉证书
			_getMyMedalBook () {
				Api.my.getMyMedalBook().then(res => {
					this.medalBook = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.m-header {
			background-color: #fff;
		}
		.list-warp {
			padding: calc(100rpx + 30rpx + var(--status-bar-height)) 32rpx 0;
			.list {
				margin-bottom: 48rpx;
				.name {
					color: $uni-text-color;
					font-size: 32rpx;
					font-weight: 500;
					margin-bottom: 28rpx;
				}
				.tab-warp {
					width: 686rpx;
					border-radius: 40rpx;
					box-shadow: 0 12rpx 24rpx 2rpx rgba(240, 240, 240, 1);
					padding-bottom: 16rpx;
					.medal-book {
						width: 100%;
						height: 482rpx;
						position: relative;
						.content {
							position: absolute;
							top: 200rpx;
							width: 70%;
							left: 50%;
							transform: translateX(-50%);
							z-index: 2;
							font-size: 24rpx;
							color: #272727;
							font-family: STSongti-SC-Black, STSongti-SC;
							.footer {
								margin-top: 40rpx;
								display: flex;
								flex-direction: column;
								align-items: flex-end;
							}
						}
						image {
							width: 100%;
							height: 100%;
							position: absolute;
							z-index: 1;
						}
					}
					.look-medal-book {
						margin: 16rpx 32rpx 0 auto;
						width: 128rpx;
						height: 48rpx;
						line-height: 48rpx;
						border-radius: 23rpx;
						background-color: $uni-text-color-active;
						color: #fff;
						font-size: 24rpx;
						font-weight: 500;
						padding: 0;
					}
				}
			}
		}
	}
</style>
