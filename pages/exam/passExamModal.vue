<template>
	<uni-popup 
		type="center"
		ref="popup"
		:maskClick="false">
		<div class="popup">
			<div class="title">恭喜您， 考试通过！</div>
			<div class="score">{{ rate }}分</div>
			<image src="../../static/images/my/my-medal-book-mini.png"></image>
			<div class="btn-warp flex-between">
				<button class="flex-center" @click="closePopup">确定</button>
				<button class="flex-center" @click="lookMedal">查看证书</button>
			</div>
		</div>
	</uni-popup>
</template>

<script>
	export default {
		props: {
			rate: {
				type: Number,
				default: () => {
					return 0
				}
			},
			planId: {
				type: String,
				default: () => {
					return ''
				}
			}
		},
		mounted() {
			this.openPopup()
		},
		methods: {
			openPopup () {
				this.$refs.popup.open()
			},
			closePopup () {
				this.$emit('close', '')
				this.$refs.popup.close()
			},
			lookMedal () {
				this.$emit('close', '')
				this.$refs.popup.close()
				uni.navigateTo({
					url: '/pages/lookMedal/index?rate=' + this.rate + '&planId=' + this.planId
				});
			}
		}
	}
</script>

<style lang="scss">
	.popup {
		width: 572rpx;
		height: 610rpx;
		background: url('../../static/images/study/exam-pass-bg.png') no-repeat center/cover;
		text-align: center;
		padding-top: 52rpx;
		box-sizing: border-box;
		.title {
			color: $uni-text-color;
			font-size: 30rpx;
		}
		.score {
			color: $uni-text-color-active;
			font-weight: 500;
			font-size: 44rpx;
			margin: 20rpx 0 48rpx;
		}
		> image {
			width: 352rpx;
			height: 248rpx;
		}
		.btn-warp {
			margin: 40rpx auto 0;
			width: calc(100% - 148rpx);
			button {
				flex-shrink: 0;
				width: 192rpx;
				height: 60rpx;
				border-radius: 40rpx;
				font-size: 28rpx;
				padding: 0;
				margin: 0;
				&:first-of-type {
					color: $uni-text-color-grey;
					background-color: $uni-bg-color-grey;
				}
				&:last-of-type {
					color: #fff;
					background-color: $uni-border-color;
				}
			}
		}
	}
</style>
