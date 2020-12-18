<template>
	<div class="warp">
		<div class="title">
			<span>{{ page.subject }}</span>
			<image src="../../static/images/study/radio-icon.png"></image>
		</div>
		<div class="choice-warp">
			<div
				:class="['choice',{ 'active' : currentVal === item.key } ]"
				v-for="(item, index) in page.options"
				:key="index"
				@click="handlerChoice(item.key)">
				<image :src="page.choiceImgActive" v-if="currentVal === item.key"></image>
				<image :src="page.choiceImg" v-else></image>
				<span>{{ item.context }}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			page: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				currentVal: ''
			}
		},
		watch: {
			page (newVal, oldVal) {
				if (newVal.answers) {
					this.currentVal = this.page.answers
				} else if (!newVal.answers) {
					this.currentVal = ''
				}
				
			}
		},
		created() {
			this.currentVal = this.page.answers
		},
		methods: {
			// 选择
			handlerChoice(key) {
				this.currentVal = key
				this.$emit('answersRadio', key)
			}
		}
	}
</script>

<style lang="scss">
	.warp {
		.title {
			margin-bottom: 36rpx;
			span {
				color: $uni-text-color;
				font-size: 32rpx;
				font-weight: 500;
				line-height: 50rpx;
			}
			image {
				width: 106rpx;
				height: 38rpx;
				margin-left: 20rpx;
			}
		}
		.choice-warp {
			.choice {
				width: 100%;
				display: flex;
				align-items: flex-start;
				margin-bottom: 28rpx;
				padding: 10rpx 34rpx 10rpx 42rpx;
				box-sizing: border-box;
				border-radius: 57rpx;
				min-height: 34rpx;
				&:last-of-type {
					margin-bottom: 0;
				}
				image {
					flex-shrink: 0;
					width: 24rpx;
					height: 24rpx;
					margin-right: 22rpx;
					position: relative;
					top: 10rpx;
				}
				span {
					flex: 1;
					color: $uni-text-color;
					font-size: 30rpx;
					line-height: 48rpx;
				}
			}
			.active {
				background-color: $uni-bg-color-hover;
			}
		}
	}
</style>
