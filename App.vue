<script>
  import {getCookie}  from './libs/cookie.js'
  export default {
	onLaunch: function() {
		this.flagStorage()
	},
	onShow: function() {
	},
	methods: {
		flagStorage () {
			uni.getStorage({
				key: 'token',
				success: res => {
					if (!res.data) return
					this.$store.dispatch('getToken', res.data)
					uni.getStorage({
						key: 'userInfo',
						success: res => {
							if (!res.data) return
							this.$store.dispatch('getUserInfo', res.data)
							uni.switchTab({url: '/pages/study/index'})
						}
					})
				}
			})
		}
	}
  };
</script>

<style>
@import url("./static/css/reset.css");
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
