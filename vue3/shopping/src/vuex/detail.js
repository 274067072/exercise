import { reqDetailList } from "@/axios/index";
import { reqAddOrUpdateShopCart } from "@/axios/index";
import { getUUid } from "@/utils/uuid_token";

const actions = {
  async getDetailList({ commit }, id) {
    const res = await reqDetailList(id);
    commit("GETDETAILLIST", res);
  },
  async addOrUpdateShopCart({ commit }, { id, num }) {
    const res = await reqAddOrUpdateShopCart({ id, num });
    if (res.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
};
const mutations = {
  GETDETAILLIST(state, value) {
    state.detailList = value.data;
  },
};
const state = {
  detailList: {},
  uuid_tocken: getUUid(),
};
const getters = {
  categoryView({ detailList }) {
    return detailList.categoryView || {};
  },
  skuInfo({ detailList }) {
    return detailList.skuInfo || {};
  },
  spuSaleAttrList({ detailList }) {
    return detailList.spuSaleAttrList || [];
  },
};

export default {
  actions,
  mutations,
  state,
  getters,
};
