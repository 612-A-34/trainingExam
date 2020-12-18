const actions = {
	getToken ({ commit }, val) {
		commit('GET_TOKEN', val)
	},
	getUserInfo ({ commit }, val) {
		commit('GET_USER_INFO', val)
	}
}
export default actions