import axios from "axios";
// @ts-ignore
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import store from "../redux";

export const requests = axios.create({
  baseURL: "http://localhost:5000",
});

requests.interceptors.request.use(
  (config) => {
    Nprogress.start();
    store.dispatch({ type: "changeIsLoading", res: true });
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

requests.interceptors.response.use(
  (res) => {
    Nprogress.done();
    store.dispatch({ type: "changeIsLoading", res: false });
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);
