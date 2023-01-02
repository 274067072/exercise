import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import store from "@/vuex";

export const requests = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

requests.interceptors.request.use((config) => {
  nprogress.start();
  if (store.state.detail.uuid_tocken) {
    config.headers.userTempId = store.state.detail.uuid_tocken;
  }
  if (store.state.user.token) {
    config.headers.token = store.state.user.token;
  }
  return config;
});
requests.interceptors.response.use(
  (res) => {
    nprogress.done();
    return Promise.resolve(res.data);
  },
  (err) => {
    return Promise.reject(new Error(err.message));
  }
);
