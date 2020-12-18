<template>
	<div class="header" :style="{ 'padding-top': _height }">
		<div class="title">
			<image src="../../../static/images/common/back-icon.png" 
				class="back" 
				v-show="isBackShow"  
				@click="handlerbackPage"></image>
			<span>{{ title }}</span>
		</div>
	</div>
</template>

<script>
	import backPage from '../../../libs/backPage.js'
	export default {
		props: {
			title: String,
			default: () => {
				return ''
			},
			isBackShow: Boolean,
			default: () => {
				return false
			}
		},
		data () {
			return {
				_height: 0
			}
		},
		created() {
			this.setBackStyle()
		},
		methods: {
			// 设置返回按钮样式
			setBackStyle () {
				uni.getSystemInfo({
				    success: res => {
						this._height = res.statusBarHeight + 'px'
				    }
				});
			},
			// 返回上一级
			handlerbackPage () {
				backPage()
			}
		}
		
	}
</script>

<style lang="scss">
	.header {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		height: 100rpx;
		line-height: 100rpx;
		box-sizing: content-box;
		.title {
			position: relative;
			text-align: center;
			color: $uni-text-color;
			font-size: 36rpx;
			font-weight: 600;
			.back {
				width: 20rpx;
				height: 36rpx;
				position: absolute;
				left: 28rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	
</style>
