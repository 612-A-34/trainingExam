import request from "./request.js"

export default {
	// 获取轮播图数据
	getBannerList () {
		return request({
		  url: 'train/app/trainplan/banner/get',
		  method: 'GET',
		})
	},
	// 获取学习列表
	getLessonsList (params) {
		return request({
		  url: 'train/app/trainplan/list',
		  method: 'GET',
		  params
		})
	},
	// 获取学习详情
	getTrainplanDetail (params) {
		return request({
		  url: 'train/app/trainplan/detail/get',
		  method: 'GET',
		  params
		})
	},
	// 上报播放进度
	trainplanReport (params) {
		return request({
		  url: 'train/app/trainplan/report',
		  method: 'POST',
		  params
		})
	},
	// 获取播放进度
	trainGetProgress (params) {
		return request({
		  url: 'train/app/trainplan/get',
		  method: 'GET',
		  params
		})
	}
}