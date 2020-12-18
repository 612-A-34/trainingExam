<template>
	<div class="containter">
		<!-- 一级页面 （无返回按钮） -->
		<mHeader :title="title"></mHeader>
		
		<div class="nav">
			<span 
			 v-for="(item, index) in navArray"
			 :key="index"
			 :class="{ 'active' : navCurrentIndex === index }"
			 @click="choiceNav(index)">{{item}}</span>
		</div>
		
		<div class="from-warp">
			<form>
				<div class="list userName-warp">
					<image src="../../static/images/login/user-icon.png" class="icon"></image>
					<input type="text" 
						v-model="dataFrom.userName" 
						placeholder="请输入账号"
						placeholder-style="color: #B9C0CA; font-size: 28rpx;"/>
					<image src="../../static/images/login/del.png" 
						class="del" 
						v-if="dataFrom.userName"
						@click="clearTxt('userName')"></image>
				</div>
				<div class="list password-warp">
					<image src="../../static/images/login/password-icon.png" class="icon"></image>
					<input type="password" 
						v-model="dataFrom.password" 
						placeholder="请输入密码"
						placeholder-style="color: #B9C0CA; font-size: 28rpx;"/>
					<image src="../../static/images/login/del.png" 
						class="del"
						v-if="dataFrom.password"
						@click="clearTxt('password')"></image>
				</div>
				<div class="list code-warp">
					<image src="../../static/images/login/code-icon.png" class="icon"></image>
					<input type="text" 
						v-model="dataFrom.codeValue" 
						placeholder="请输入验证码"
						placeholder-style="color: #B9C0CA; font-size: 28rpx;"/>
					<image src="../../static/images/login/del.png" 
						class="del"
						v-if="dataFrom.codeValue"
						@click="clearTxt('codeValue')"></image>
					<image 
						:src="codeImage" 
						class="code"
						@click="_getAuthCode"></image>
				</div>
				<button type="default"
					:class="{ 'isSubmit' : isSubmit}"
					@click="_login">登录</button>
			</form>
		</div>
	</div>
</template>

<script>
	import mHeader from '../components/mHeader/index'
	import { baseReplace, aesEncryto } from '../../libs/utils.js'
	import {setCookie}  from '../../libs/cookie.js'
	import Api from '../../api/api.js'
	export default {
		data () {
			 return {
				 title: '登录',
				 navArray: ['各级监管部门', '生产经营单位'],
				 navCurrentIndex: 0,
				 isSubmit: false,
				 dataFrom: {
					userName: '',
					password: '',
					codeValue: '',
					codeKey: ''
				 },
				 codeImage: '',
				 encryptKey: ''
			 }
		},
		watch: {
			dataFrom: {
				handler(e) {
					if (e.userName && e.password && e.codeValue ) 
					this.isSubmit = true
				},
				deep: true
			}
		},
		components: {
			mHeader
		},
		created() {
			this._getAuthCode()
			this._queryEncryptKey()
		},
		onLoad(){
			
		},
		methods: {
			// 获取验证码
			_getAuthCode () {
				Api.login.getAuthCode().then(res => {
					this.codeImage = baseReplace(res.data.image)
					this.dataFrom.codeKey = res.data.key
				})
			},
			// 获取登录密钥
			_queryEncryptKey () {
				Api.login.queryEncryptKey().then(res => {
					this.encryptKey = res.data[0].cvalue
				})
			},
			// 加密账号密码
			encryptFrom () {
				const userName = aesEncryto(this.dataFrom.userName, this.encryptKey)
				const password = aesEncryto(this.dataFrom.password, this.encryptKey)
				return {
					userName,
					password
				}
			},
			// 登录
			_login () {
				if (!this.isSubmit) return
				const upkeyFrom = this.encryptFrom()
				const parmas = {
					...upkeyFrom,
					codeKey: this.dataFrom.codeKey,
					codeValue: this.dataFrom.codeValue
				}
				Api.login.login(parmas).then(res => {
					if (res.code !== 1) return
					this.$store.dispatch('getToken', res.data.token)
					this.$store.dispatch('getUserInfo', res.data)
					
					uni.setStorage({
					    key: 'token',
					    data: res.data.token
					})
					
					uni.setStorage({
					    key: 'userInfo',
					    data: res.data
					})
					
					uni.showToast({
						title: res.msg,
						duration: 2000,
						success: () => {
							uni.switchTab({
								url: '/pages/study/index'
							})
						}
					})
				})
			},
			// 导航改变
			choiceNav (idx) {
				this.navCurrentIndex = idx
				this.dataFrom = {
					userName: '',
					password: '',
					codeValue: ''
				}
				this.isSubmit = false
			},
			// 清空内容
			clearTxt (type) {
				this.dataFrom[type] = ''
			}
		}
	}
</script>

<style lang="scss">
	.containter {
		width: 100vw;
		height: 100vh;
		background: url('../../static/images/login/login-bg.png') #fff no-repeat;
		background-size: cover;
		.nav {
			padding: 220rpx 0 78rpx;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 512rpx;
			span {
				width: 256rpx;
				line-height: 72rpx;
				font-size: 28rpx;
				text-align: center;
				background-color: $uni-bg-color-hover;
				color: #738296;
				font-size: 28rpx;
				&:first-of-type {
					border-radius: 36rpx 0 0 36rpx;
				}
				&:last-of-type {
					border-radius: 0 36rpx 36rpx 0;
				}
			}
			.active {
				background-color: $uni-bg-color;
				color: #fff;
			}
		}
		.from-warp {
			padding: 0 60rpx;
			form {
				.list {
					display: flex;
					align-items: center;
					height: 108rpx;
					position: relative;
					.icon {
						flex-shrink: 0;
						width: 32rpx;
						height: 32rpx;
						margin-right: 4rpx;
					}
					input {
						width: calc(100% - 36rpx - 28rpx);
						border-bottom: 2rpx solid #F6F7F9;
						padding: 0 26rpx;
						height: 100%;
						box-sizing: border-box;
						color: $uni-text-color-grey;
					}
					.del {
						width: 28rpx;
						height: 28rpx;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						right: 0;
					}
				}
				.code-warp {
					input {
						width: calc(100% - 36rpx - 140rpx - 38rpx);
					}
					.del {
						right: 150rpx;
					}
					.code {
						position: absolute;
						top: 50%;
						right: 0;
						transform: translateY(-50%);
						width: 140rpx;
						height: 60rpx;
					}
				}
				button {
					margin-top: 120rpx;
					color: #fff;
					background-color: #B3DDF3;
					border-radius: 45rpx;
					height: 88rpx;
					font-size: 32rpx;
					letter-spacing: 6rpx;			
					font-weight: 500;
				}
				.isSubmit {
					background-color: $uni-bg-color;
				}
			}
		}
	}
</style>
