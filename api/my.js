import request from "./request.js"

export default {
	// 获取我的荣誉证书
	getMyMedalBook () {
		return request({
			url: 'train/app/exam/certificate/list/get'
		})
	},
	
	// 获取选调培训记录
	getStudyRecord () {
		return request({
			url: 'train/trainsamplerecordpeople/app/list'
		})
	},
	
	// 退出
	logout (params) {
		return request({
			url: 'auth/api/ssoLogin.do',
			method: 'POST',
			params
		})
	}
}