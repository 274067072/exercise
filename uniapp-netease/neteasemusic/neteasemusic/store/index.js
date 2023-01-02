import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	actions: {},
	mutations: {
		SETPLAYLIST(state, playlist) {
			state.playlist = playlist
		},
		SETCURRENTID(state, currentId) {
			state.currentId = currentId
		},
		SETBGM(state, bgm) {
			state.bgm = bgm
		}
	},
	state: {
		playlist: [],
		currentId: null,
		bgm: null
	}
})
