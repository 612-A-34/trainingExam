import request from "./request.js"

export default {
	// 获取考试信息
	getExamInfo (params) {
		return request({
			url: 'train/app/exam/info/get',
			params
		})
	},
	
	// 提交试卷
	commitPage (params) {
		return request({
			url: 'train/app/exam/commit',
			method: 'POST',
			params
		})
	},
	
	// 获取单个证书
	getMedalBook (params) {
		return request({
			url: 'train/app/exam/certificate/get',
			params
		})
	}
}