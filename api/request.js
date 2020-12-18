const baseUrl = "http://47.92.194.246:6661/"
// const baseUrl = "http://111.62.218.242:6661/"
// const baseUrl = "http://81.71.119.84:21007/" // 孟臣主机

import store from '../store/index'

export default (options) => {
	return new Promise((resolve, reject) => {
	    uni.request({
			url: baseUrl + options.url,
			method: options.method || 'GET',
			header: {
				'Content-Type': options.contentType || 'application/json; charset=utf-8;',
				'Authorization': store.state.token || ''
			},
			data: options.params,
			success: res => {
				const data = res.data
				if( data.code === 1){
					resolve(data)
				} else {
					uni.showToast({
						title: data.msg,
						icon: 'none'
					})
					reject(data.msg)
				}
			},
			fail: err => {
				uni.showToast({
					title: '请检查您的网络',
					icon: 'none'
				})
				reject(err);
			},
			complete: () => {
			}
		});
	});
};
