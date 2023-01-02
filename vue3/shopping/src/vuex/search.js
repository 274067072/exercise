import { reqSearchList } from "@/axios/index";

const actions = {
  async getSearchList({ commit }, params) {
    const res = await reqSearchList(params);
    commit("GETSEARCHLIST", res);
  },
};
const mutations = {
  GETSEARCHLIST(state, value) {
    state["searchList"] = value.data;
  },
};
const state = {
  searchList: {},
};
const getters = {
  attrsList({ searchList }) {
    return searchList.attrsList || [];
  },
  goodsList({ searchList }) {
    return searchList.goodsList || [];
  },
  trademarkList({ searchList }) {
    return searchList.trademarkList || [];
  },
  pageNo({ searchList }) {
    return searchList.pageNo || "";
  },
  totalPages({ searchList }) {
    return searchList.totalPages || "";
  },
};

export default {
  actions,
  mutations,
  state,
  getters,
};
