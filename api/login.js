import request from "./request.js"

export default {
	// 新-获取登录秘钥
	queryEncryptKey (params) {
		return request({
			url:'utils/config/list',
			method: 'post',
			params
		})
	},
	
	// 登录
	login (params) {
		return request({
		  url: 'auth/api/login.do',
		  method: 'POST',
		  contentType: 'application/x-www-form-urlencoded',
		  params
		})
	},

	// 获取验证码图片
	getAuthCode (params) {
		return request({
			url: "utils/captcha/image",
			method: "POST",
			params
		})
	}
}