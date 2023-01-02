import {
  reqCode,
  reqRegist,
  reqLogin,
  reqUserInfo,
  reqLogout,
} from "@/axios/index";
import { setToken, getToken, removeToken } from "@/utils/token";
const actions = {
  async getCode({ commit }, phone) {
    const res = await reqCode(phone);
    if (res.code == 200) {
      commit("GETCODE", res);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  async regist({ commit }, data) {
    const res = await reqRegist(data);
    if (res.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  async login({ commit }, data) {
    const res = await reqLogin(data);
    if (res.code == 200) {
      setToken(res.data.token);
      commit("LOGIN", res);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  async getUserInfo({ commit }) {
    const res = await reqUserInfo();
    if (res.code == 200) {
      commit("GETUSERINFO", res);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  async logout({ commit }) {
    const res = await reqLogout();
    if (res.code == 200) {
      commit("LOGOUT");
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
};
const mutations = {
  GETCODE(state, value) {
    state.code = value.data;
  },
  LOGIN(state, value) {
    state.token = value.data.token;
  },
  GETUSERINFO(state, value) {
    state.userInfo = value.data;
  },
  LOGOUT(state) {
    removeToken();
    state.token = "";
    state.userInfo = {};
  },
};
const state = {
  code: "",
  token: getToken(),
  userInfo: {},
};
const getters = {};

export default {
  actions,
  mutations,
  state,
  getters,
};
