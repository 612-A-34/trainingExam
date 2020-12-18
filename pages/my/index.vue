<template>
	<div class="containter">
		<!-- 一级页面 （无返回按钮） -->
		<mHeader :title="title" :isBackShow="false" class="m-header"></mHeader>
		<div class="main">
			<div class="info-cart">
				<image src="../../static/images/my/default-picture.png" class="user-picture"></image>
				<div class="info-warp">
					<div class="name-warp">{{ userInfo.userName }}</div>
					<div class="company-warp">{{ userInfo.orgList[0].oname }}</div>
					<div class="phone-warp">
						<span class="label">电   话</span>
						<span class="phone">：{{ myInfo.phone }}</span>
						<image src="../../static/images/my/open-eye.png" class="open-eye" 
							v-if="phoneFlag"
							@click="handlerPhoneStatus"></image>
						<image src="../../static/images/my/close-eye.png" class="close-eye" 
							v-else
							@click="handlerPhoneStatus"></image>
					</div>
					<div class="cartId-warp">
						<span class="label">身份证</span>
						<span class="cartId-warp">：{{ myInfo.cartId }}</span>
						<image src="../../static/images/my/open-eye.png" class="open-eye" 
							v-if="cardIdFlag"
							@click="handlerCartIdStatus"></image>
						<image src="../../static/images/my/close-eye.png" class="close-eye" 
							v-else
							@click="handlerCartIdStatus"></image>
					</div>
				</div>
			</div>
			<ul class="list-warp">
				<li class="list"
					v-for="(item, index) in listArray"
					:key="index"
					@click="handlerTo(item.linkHref)">
					<div class="left">
						<image :src="item.icon" class="icon"></image>
						<span>{{ item.title }}</span>
					</div>
					<image src="../../static/images/my/more.png" class="more"></image>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import mHeader from '../components/mHeader/index'
	import { formatIdcard, formatPhone } from '../../libs/utils.js'
	import { clearCookie }  from '../../libs/cookie.js'
	import Api from '../../api/api.js'
	export default {
		data () {
			return {
				title: '我的',
				myInfo: {
					phone: '13800008888',
					cartId: '230202199000010097'
				},
				userInfo: {},
				phoneFlag: true,
				cardIdFlag: true,
				listArray: [{
					icon: '../../static/images/my/my-medal-icon.png',
					title: '我的证书',
					linkHref: '/pages/myMedal/index'
				},{
					icon: '../../static/images/my/study-record-icon.png',
					title: '选调培训记录',
					linkHref: '/pages/studyRecord/index'
				},{
					icon: '../../static/images/my/logout-icon.png',
					title: '退出当前帐号'
				}],
				phone: '',
				cartId: ''
			}
		},
		components: {
			mHeader
		},
		created() {
			this._getUserInfo()
		},
		methods: {
			// 从仓库拿个人信息
			_getUserInfo () {
				this.userInfo = this.$store.state.userInfo
			},
			// 手机号改变状态
			handlerPhoneStatus () {
				this.phoneFlag = !this.phoneFlag
				if (this.phoneFlag) {
					this.myInfo.phone = this.phone
				} else {
					this.phone = this.myInfo.phone
					this.myInfo.phone = formatPhone(this.myInfo.phone)
				}
			},
			// 身份证号改变状态
			handlerCartIdStatus () {
				this.cardIdFlag = !this.cardIdFlag
				if (this.cardIdFlag) {
					this.myInfo.cartId = this.cartId
				} else {
					this.cartId = this.myInfo.cartId
					this.myInfo.cartId = formatIdcard(this.myInfo.cartId)
				}
			},
			// 列表跳转
			handlerTo (href) {
				if (href) {
					uni.navigateTo({
						url: href
					})
				} else {
					this.logout()
				}
			},
			// 退出
			logout () {
				uni.showModal({
					title: '提示',
					content: '确定要退出吗？',
					success: (res) => {
						if (res.confirm) {
							this.$store.commit('GET_TOKEN', '')
							this.$store.commit('GET_USER_INFO', {})
							uni.clearStorage()
							uni.reLaunch({
								url: '/pages/login/index'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.containter {
		.m-header {
			background-color: #fff;
		}
		.main {
			padding: calc(100rpx + 30rpx + var(--status-bar-height)) 32rpx 0;
			.info-cart {
				width: 686rpx;
				height: 278rpx;
				background: #4BADFF  url('../../static/images/my/info-bg.png') no-repeat center/cover;
				margin: 0 0 46rpx;
				padding: 40rpx 0 0 40rpx;
				box-sizing: border-box;
				display: flex;
				border-radius: 40rpx;
				box-shadow: 0 6rpx 28rpx 2rpx rgba(209,233,253,1);
				.user-picture {
					flex-shrink: 0;
					width: 132rpx;
					height: 132rpx;
					border-radius: 50%;
					margin-right: 40rpx;
				}
				.info-warp {
					color: #fff;
					.name-warp {
						font-size: 36rpx;
						font-weight: 600;
						line-height: 50rpx;
					}
					.company-warp {
						font-size: 26rpx;
						margin: 8rpx 0 20rpx;
					}
					.phone-warp {
						margin-bottom: 12rpx;
					}
					.phone-warp, .cartId-warp {
						font-size: 22rpx;
						.label {
							width: 88rpx;
							display: inline-block;
							text-align: justify;
							text-align-last: justify;
						}
						.open-eye {
							width: 26rpx;
							height: 18rpx;
							margin-left: 14rpx;
						}
						.close-eye {
							width: 26rpx;
							height: 12rpx;
							margin-left: 32rpx;
						}
					}
				}
			}
			.list-warp {
				.list {
					height: 104rpx;
					border-bottom: 2rpx solid $uni-bg-color-grey;
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: $uni-text-color;
					font-size: 26rpx;
					.left {
						image {
							width: 38rpx;
							height: 38rpx;
							margin-right: 26rpx;
							position: relative;
							top: -2rpx;
						}
					}
					.more {
						width: 12rpx;
						height: 22rpx;
					}
				}
			}
		}
	}
</style>
