<template>
	<uni-popup 
		type="center"
		ref="popup"
		:maskClick="false">
		<div class="popup">
			<div class="title">考试未通过， 再接再厉！</div>
			<div class="score">{{ rate }}分</div>
			<div class="btn-warp flex-between">
				<button class="flex-center" @click="closePopup">确定</button>
				<button class="flex-center" @click="reExam">再次考试</button>
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
			}
		},
		mounted() {
			this.openPopup()
		},
		methods: {
			reExam () {
				this.closePopup()
				this.$emit('reExam')
			},
			openPopup () {
				this.$refs.popup.open()
			},
			closePopup () {
				this.$emit('close', '')
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss">
	.popup {
		width: 572rpx;
		height: 350rpx;
		text-align: center;
		padding-top: 52rpx;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 20rpx;
		.title {
			color: $uni-text-color;
			font-size: 30rpx;
		}
		.score {
			color: $uni-text-color-grey;
			font-weight: 500;
			font-size: 44rpx;
			margin: 36rpx 0 60rpx;
		}
		.btn-warp {
			margin: 0 auto;
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
