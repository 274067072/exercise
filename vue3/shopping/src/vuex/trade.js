import { reqOrderInfo, reqSubmitOrder } from "@/axios/index";

const actions = {
  async getOrderInfo({ commit }) {
    const res = await reqOrderInfo();
    if (res.code == 200) {
      commit("GETORDERINFO", res);
    }
  },
  async submitOrder({ commit }, { tradeNo, data }) {
    const res = await reqSubmitOrder(tradeNo, data);
    if (res.code == 200) {
      commit("SUBMITORDER", res);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
};
const mutations = {
  GETORDERINFO(state, value) {
    state.orderInfo = value.data;
  },
  SUBMITORDER(state, value) {
    state.orderId = value.data;
  },
};
const state = {
  orderInfo: {},
  orderId: "",
};
const getters = {
  addressList(state) {
    return state.orderInfo.userAddressList || [];
  },
  detailList(state) {
    return state.orderInfo.detailArrayList || [];
  },
};

export default {
  actions,
  mutations,
  state,
  getters,
};
