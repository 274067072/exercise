import { requests } from "./requests";
import { mockRequests } from "./mockRequests";

export const reqCategoryList = () => {
  return requests({ method: "get", url: "/product/getBaseCategoryList" });
};

export const reqSearchList = (params) => {
  return requests({ method: "post", url: "/list", data: params });
};
export const reqDetailList = (id) => {
  return requests({ method: "get", url: `/item/${id}` });
};
export const reqAddOrUpdateShopCart = ({ id, num }) => {
  return requests({ method: "post", url: `/cart/addToCart/${id}/${num}` });
};
export const reqShopCarList = () => {
  return requests({ method: "get", url: "/cart/cartList" });
};
export const reqDeleteShopcarProduct = (id) => {
  return requests({ method: "delete", url: `/cart/deleteCart/${id}` });
};
export const reqUpdateCheck = ({ id, isChecked }) => {
  return requests({
    method: "get",
    url: `/cart/checkCart/${id}/${isChecked}`,
  });
};
export const reqCode = (phone) => {
  return requests({
    method: "get",
    url: `/user/passport/sendCode/${phone}`,
  });
};
export const reqRegist = (data) => {
  return requests({
    method: "post",
    url: "/user/passport/register",
    data,
  });
};
export const reqLogin = (data) => {
  return requests({
    method: "post",
    url: "/user/passport/login",
    data,
  });
};
export const reqUserInfo = () => {
  return requests({
    method: "get",
    url: "/user/passport/auth/getUserInfo",
  });
};
export const reqLogout = () => {
  return requests({
    method: "get",
    url: "/user/passport/logout",
  });
};
export const reqOrderInfo = () => {
  return requests({
    method: "get",
    url: "/order/auth/trade",
  });
};
export const reqSubmitOrder = (tradeNo, data) => {
  return requests({
    method: "post",
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    data,
  });
};
export const reqPayInfo = (orderId) => {
  return requests({
    method: "get",
    url: `/payment/weixin/createNative/${orderId}`,
  });
};
export const reqPayState = (orderId) => {
  return requests({
    method: "get",
    url: `/payment/weixin/queryPayStatus/${orderId}`,
  });
};
export const reqMyOrder = (page, limit) => {
  return requests({
    method: "get",
    url: `/order/auth/${page}/${limit}`,
  });
};
export const reqBannerList = () => {
  return mockRequests({ method: "get", url: "/banner" });
};
