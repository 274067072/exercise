import { reqMyOrder } from "@/axios";
const actions = {
  async getMyOrder({ commit }, { page, limit }) {
    const res = await reqMyOrder(page, limit);
    if (res.code == 200) {
      commit("GETMYORDER", res);
    }
  },
};
const mutations = {
  GETMYORDER(state, value) {
    state.orderInfo = value.data;
  },
};
const state = {
  orderInfo: {},
};
const getters = {
  records(state) {
    return state.orderInfo.records || [];
  },
};

export default {
  actions,
  mutations,
  state,
  getters,
};
