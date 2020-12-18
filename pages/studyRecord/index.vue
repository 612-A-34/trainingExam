<template>
	<div class="container">
		<!-- 二级页面 （有返回按钮） -->
		<mHeader :title="title" class="m-header" :isBackShow="true"></mHeader>
		<div class="list-warp">
			<div class="list"
				v-for="(item, index) in studyRecord"
				:key="index">
				<div class="title-warp">
					<p class="title">{{ item.name }}</p>
					<span class="status">{{ item.isParticipate === 0 ? '未参加' : '已参加' }}</span>
				</div>
				<div class="info-warp">
					<span>{{ item.type === 1 ? '线上' : '线下' }}</span>
					<span>{{ item.duration }}课时</span>
				</div>
				<div class="time">{{ item.startTime }}-{{ item.endTime }}</div>
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
				title: '选调培训记录',
				studyRecord: [{
					title: '这里是培训的名称这里是培训的名称',
					type: '线上/线下',
					class: '4',
					time: '2020.08.08 10:00-2020.08.08 12:00'
				},{
					title: '这里是培训的名称这里是培训的名称',
					type: '线上/线下',
					class: '4',
					time: '2020.08.08 10:00-2020.08.08 12:00'
				},{
					title: '这里是培训的名称这里是培训的名称',
					type: '线上/线下',
					class: '4',
					time: '2020.08.08 10:00-2020.08.08 12:00'
				}]
			}
		},
		components: {
			mHeader
		},
		created() {
			this._getStudyRecord()
		},
		methods: {
			// 获取选调培训记录
			_getStudyRecord () {
				Api.my.getStudyRecord().then(res => {
					this.studyRecord = res.data
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
				padding: 32rpx 24rpx 0;
				box-shadow: 0 12rpx 24rpx 2rpx rgba(240, 240, 240, 1);
				border-radius: 20rpx;
				margin-bottom: 32rpx;
				.title-warp {
					display: flex;
					align-items: center;
					.title {
						color: $uni-text-color;
						font-size: 32rpx;
						font-weight: 500;
					}
					span {
						flex-shrink: 0;
						width: 84rpx;
						line-height: 36rpx;
						background: #F2FAFE;
						border-radius: 19rpx;
						margin-left: 16rpx;
						background-color: $uni-bg-color-hover;
						color: $uni-border-color;
						font-size: 20rpx;
						text-align: center;
					}
				}
				.info-warp {
					margin: 16rpx 0 32rpx;
					span {
						display: inline-flex;
						justify-content: center;
						align-items: center;
						height: 36rpx;
						border-radius: 20rpx 36rpx 36rpx 0;
						font-size: 20rpx;
						box-sizing: border-box;
						padding: 4rpx 10rpx;
						&:first-of-type {
							border: 2rpx solid $uni-text-color-highlight;
							color: $uni-text-color-highlight;
							margin-right: 16rpx;
						}
						&:last-of-type {
							border: 2rpx solid $uni-tab-color;
							color: $uni-tab-color;
						}
					}
				}
				.time {
					display: flex;
					align-items: center;
					height: 66rpx;
					color: $uni-text-color-grey;
					font-size: 24rpx;
					border-top: 2rpx solid $uni-bg-color-grey;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
