import { reqPayInfo } from "@/axios";

const actions = {
  async getPayInfo({ commit }, orderId) {
    const res = await reqPayInfo(orderId);
    if (res.code == 200) {
      commit("GETPAYINFO", res);
    }
  },
};
const mutations = {
  GETPAYINFO(state, value) {
    state.payInfo = value.data;
  },
};
const state = {
  payInfo: {},
};
const getters = {};

export default {
  actions,
  mutations,
  state,
  getters,
};
