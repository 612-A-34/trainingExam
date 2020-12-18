const mutations = {
	GET_TOKEN (state, val) {
		state.token = val
	},
	GET_USER_INFO (state, val) {
		state.userInfo = val
	},
	SET_ASK_EXAM_NUM (state, val) {
		state.askExamNum = val
	}
}
export default mutations