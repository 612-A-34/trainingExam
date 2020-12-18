<template>
    <view class="study-content">
		<!-- 一级页面 （无返回按钮） -->
		<mHeader :title="title" class="header"></mHeader>
		<!-- 轮播图 -->
		<view class="page-section-spacing">
			<swiper class="swiper"
				:circular="true"
				:autoplay="true"
				interval="3000"
				duration="1500"
				previous-margin="40rpx"
				next-margin="40rpx">
				<swiper-item v-for="(item , index) in homeSlide" :key="index" class="swiper-item">
					<image :src="item.coverUrl"></image>
				</swiper-item>
			</swiper>
		</view>
		<!--tab切换-->
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" 
				  class="nav-item" :class="{ current: tabCurrentIndex === index }" 
				  @tap="tabClick(item.status)">
				  {{ item.text }}
			</view>
		</view>
		<!--选项卡内容 -->
		<view v-if="lessonList.length !== 0">
			<view class="training-list" v-for="(item, index1) in lessonList" :key="index1">
				<view class="training-title flex-start">{{ item.planName}}
				   <view class="training-title-status statusNoexam" v-if="item.result === 0 && tabCurrentIndex === 2">未考试</view>
				   <view class="training-title-status statusFail" v-if="item.result === 1 && tabCurrentIndex === 2">不合格</view>
				   <view class="training-title-status statusSuccess" v-if="item.result === 2 && tabCurrentIndex === 2">合格</view>
				</view>
				<view class="training-content">
					<view class="training-content-img" @tap="jump2learnDetail(item.planId)">
						<image :src="'http://47.92.194.246:6661/biz/biz-system' + item.coverPath"></image>
						<image src="../../static/images/common/play-btn@2x.png"></image>
					</view>
					<view class="training-content-detail flex-between">
						<view class="training-content-info flex-between">
							<view class="lesson">{{item.duration}}课时</view>
							<view class="time">{{ second2minute(item.secondDuration)}}</view>
						</view>
						<view class="training-content-operate flex-between">
							<view class="btn" v-if="tabCurrentIndex === 0" @tap="jump2learnDetail(item.planId)">开始学习</view>
							<view class="btn" v-if="tabCurrentIndex === 1" @tap="jump2learnDetail(item.planId)">继续学习</view>
							<view class="btn" v-if="tabCurrentIndex === 2" @tap="jump2learnDetail(item.planId)">重新学习</view>
							<view class="btn" v-if="tabCurrentIndex === 2" @tap="jump2exam(item.planId, item.planPeopleId)">参加考试</view>
						</view>
					</view>
				</view>					
			</view>
		</view> 
		<view v-else class="flex-center">
			<view class="no-data flex-clo-between">
				<image src="../../static/images/common/study-noData@2x.png"></image>
				<text>暂无培训课程</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import mHeader from '../components/mHeader/index'
	import Api from '../../api/api.js'
	import {formatSeconds} from '../../libs/replace.js'
    export default {
        data() {
            return {
				title: '首页',
				scrollTop: 0, // 设置竖向滚动条位置
				homeSlide: [
					{
						coverUrl:'../../static/images/handConfig/lunbo@2x.png'
					}
				],
				tabCurrentIndex: 0,
				navList: [
					{
						status: 0,
						text: '待学习'
					},
					{
						status: 1,
						text: '正在学习'
					},
					{
						status: 2,
						text: '学习结束'
					}
				],
                lessonList: [
				// 	{
				// 	planName: '',
				// 	duration: '',
				// 	secondDuration: '0',
				// 	path: null,
				// 	coverPath: '',
				// 	result: 0,
				// 	completionRate: 0,
				// 	completedDuration: null,
				// 	planId: '',
				// 	examFlag: 1,
				// 	planPeopleId: ''
				// }
				]
			};
        },
		computed: {
		},
		components: {
			mHeader
		},
        created() {
			// 页面显示是默认选中第一个
		    this.tabCurrentIndex = 0
			this.getRecombBanner()
			this._getLessonList(0)
        },
        methods:{
			// 跳转到学习详情
			jump2learnDetail(id){
				console.log('传递参数',id)
				uni.navigateTo({
				    url: '/pages/study/learnDetail?planId='+ id + '&status=' + this.tabCurrentIndex
				})
			},
			// 跳转到考试页面
			jump2exam (id,planPeopleId) {
			  uni.navigateTo({
			      url: '/pages/exam/index?planId='+ id + "&planPeopleId=" + planPeopleId
			  })
			},
			//  获取数据轮播图数据
			getRecombBanner(){
				Api.study.getBannerList().then(res => {
					console.log('首页banner数据',res)
					if(res.code === 1){
					  this.homeSlide = res.data
					}
				})
			},
			// 点击切换分类
			tabClick(item){
			  this.tabCurrentIndex = item;
			  console.log('修改数据', item)
			  this._getLessonList(item)
			},
			// 获取学习列表数据
			_getLessonList(param){ 
				this.lessonList = []
				Api.study.getLessonsList({status: param}).then(res => {
					console.log('学习列表数据',res)
					if(res.code === 1 && res.data.length !== 0){
					  this.lessonList = res.data
					} else {
					  uni.showToast({
					      title: '暂无数据',
					      duration: 1500,
						  icon: 'none'
					  })
					}
				})		
			},
			// 时间转化
			second2minute(item){
			  return formatSeconds(item)
			}
        }
    }
</script>
<style lang="scss">
	.header {
		background-color: #fff;
	}
	.study-content{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.page-section-spacing {
			width: 100%;
			padding-top: calc(100rpx + 30rpx + var(--status-bar-height));
			.swiper{
				width: 100%;
				height: 360rpx;
				/* swiper-item 里面的图片高度 */
				.swiper-item image{
					width: 650rpx;
					height: 300rpx;
					border-radius: 30rpx;
				}
			}
		}
	} 
	.navbar {
		width: 100%;
		display: flex;
		height: 80rpx;
		padding: 0 10rpx;
		background: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 1;
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30rpx;
			color: $uni-text-color-grey;
			position: relative;
			&.current {
				color: #008CD6;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 88rpx;
					height: 0;
					border-bottom: 4rpx solid #008CD6;
				}
			}
		}
	}
	.training-list{
		width: 686rpx;
		height: 500rpx;
	    .training-title{
		  height: 86rpx;
		  font-size: 32rpx;
		  font-family: PingFangSC-Medium, PingFang SC;
		  font-weight: 500;
		  color: #1C2F54;
		  line-height: 86rpx;
		  .training-title-status{
			  width: 84rpx;
			  height: 36rpx;
			  border-radius: 20rpx;
			  font-size: 20rpx;
			  font-family: PingFangSC-Regular, PingFang SC;
			  font-weight: 400;
			  line-height: 36rpx;
			  text-align: center;
			  margin-left: 16rpx;
		  }
		  .statusNoexam{
			 background: $uni-bg-color-hover;
			 color: $uni-text-color-active;
		  }
		  .statusFail{
		  	 background: #FFF4E8;
			 color: #EF7F00;
		  }
		  .statusSuccess{
		  	 background: #EDFAF3;
			 color: #36B773;
		  }
		}
		.training-content{
			width: 686rpx;
			height: 380rpx;
			background: #FFFFFF;
			box-shadow: 0px 12rpx 24rpx 2rpx #F0F0F0;
			border-radius: 40rpx;
			.training-content-img{
				position: relative;
			    image:nth-child(1){
				  width: 686rpx;
				  height: 300rpx;
				  border-radius: 40rpx 40rpx 0px 0px;
				}
				image:nth-child(2){
				  position: absolute;
				  top: 100rpx;
				  left: 294rpx;
				  width: 100rpx;
				  height: 100rpx;
				}
			}
			.training-content-info{
				width: 200rpx;
				height: 80rpx;
				margin-left: 32rpx;
				font-size: 20rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				line-height: 36rpx;
				.lesson{
					text-align: center;
					color: #EF7F00;
					min-width: 72rpx;
					height: 36rpx;
					border-radius: 200rpx 200rpx 200rpx 0;
					border: 2rpx solid #EF7F00;
				}
				.time{
					text-align: center;
					color: #58A1FD;
					min-width: 86rpx;
					height: 36rpx;
					border-radius: 200rpx 200rpx 200rpx 0;
					border: 2rpx solid #58A1FD;
				}
			}
			.training-content-operate{
				.btn{
					text-align: center;
					width: 128rpx;
					height: 48rpx;
					background: #008CD6;
					border-radius: 24rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 48rpx;
				}
				
			}
			
		}
	}
	.no-data{
		margin-top: 152rpx;
		image{
			width: 256rpx;
			height: 122rpx;
		}
		text{
			margin-top: 24rpx;
			font-size: 12px;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: #B9C0CA;
			line-height: 17px;
		}
	}
</style>
