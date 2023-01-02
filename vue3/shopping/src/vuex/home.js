import { reqBannerList } from "@/axios";
const actions = {
  async getBannerList({ commit }) {
    const res = await reqBannerList();
    commit("GETBANNERLIST", res);
  },
};
const mutations = {
  GETBANNERLIST(state, value) {
    state.bannerList = value.data;
  },
};
const state = {
  bannerList: [],
};
const getters = {};

export default {
  actions,
  mutations,
  state,
  getters,
};
