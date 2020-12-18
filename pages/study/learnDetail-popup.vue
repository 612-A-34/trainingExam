<template>
	<uni-popup  type="center" ref="popup" :maskClick="false">
		<div class="popup">
			<div class="title">温馨提示</div>
			<div class="score">{{markedWords.words}}</div>
			<!--二十分钟，是否继续学习-->
			<div class="btn-warp flex-between" v-if="markedWords.type === 0">
				<button class="flex-center" @click="closePopup">否</button>
				<button class="flex-center" @click="closePopup">继续学习</button>
			</div>
			<!--不能快进-->
			<div class="btn-warp flex-center" v-if="markedWords.type === 1">
				<button class="flex-center" @click="closePopup">确定</button>
			</div>
			<!--学习完是否考试-->
			<div class="btn-warp flex-between" v-if="markedWords.type === 2">
				<button class="flex-center" @click="closePopup">暂不考试</button>
				<button class="flex-center" @click="takeTest">参加考试</button>
			</div>
		</div>
	</uni-popup>
</template>

<script>
	export default {
		data() {
		    return {
		  }
		},
		props: {
		  markedWords: {
		    type: Object,
		       default() {
		         return {
					 words: '',
					 type: 0 // type=0:20分钟是否继续学习，type = 1：不能快进， type =2： 学习完是否考试
				 };
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
			// 参加考试
			takeTest () {
				this.$emit('takeTest', '')
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss">
	.popup {
		width: 572rpx;
		height: 308rpx;
		background: rgba(255, 255, 255, 0.99);
		text-align: left;
		padding-top: 40rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		z-index: 300;
		.title {
			margin-left: 48rpx;
			color: $uni-text-color;
			font-size: 30rpx;
			width: 120rpx;
			height: 42rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			line-height: 42rpx;
		}
		.score {
			font-size: 30rpx;
			margin: 36rpx 0 60rpx 48rpx;
			height: 42rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #1C2F54;
			line-height: 42rpx;
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
