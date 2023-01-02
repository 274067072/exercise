import {
  reqShopCarList,
  reqDeleteShopcarProduct,
  reqUpdateCheck,
} from "@/axios/index";
const actions = {
  async getShopcarList({ commit }) {
    const res = await reqShopCarList();
    if (res.code == 200) {
      commit("GETSHOPCARLIST", res);
    }
  },
  async deleteProduct({ commit }, id) {
    const res = await reqDeleteShopcarProduct(id);
    if (res.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  async updateCheck({ commit }, { id, isChecked }) {
    const res = await reqUpdateCheck({ id, isChecked });
    if (res.code == 200) {
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  deleteAllcheckedProduct({ dispatch, getters }) {
    let promiseArr = [];
    getters.cartInfoList.forEach((element) => {
      if (element.isChecked == 1) {
        const promise = dispatch("deleteProduct", element.skuId);
        promiseArr.push(promise);
      }
    });
    return Promise.all(promiseArr);
  },
  changeAllCheckState({ dispatch, getters }, isChecked) {
    let promiseArr = [];
    getters.cartInfoList.forEach((element) => {
      const promise = dispatch("updateCheck",{id:element.skuId, isChecked});
      promiseArr.push(promise);
    });
    return Promise.all(promiseArr);
  },
};
const mutations = {
  GETSHOPCARLIST(state, value) {
    state.shopcarList = value.data[0] || {};
  },
};
const state = {
  shopcarList: {},
};
const getters = {
  cartInfoList(state) {
    return state.shopcarList.cartInfoList || [];
  },
};

export default {
  actions,
  mutations,
  state,
  getters,
};
