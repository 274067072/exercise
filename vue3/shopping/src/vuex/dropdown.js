import { reqCategoryList } from "@/axios";
const actions = {
  async getCategoryList({ commit }) {
    const res = await reqCategoryList();
    commit("GETCATEGORYLIST", res);
  },
};
const mutations = {
  GETCATEGORYLIST(state, value) {
    state.categoryList = value.data;
  },
};
const state = {
  categoryList: [],
};
const getters = {};

export default {
  actions,
  mutations,
  state,
  getters,
};
