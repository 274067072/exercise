import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
export const requests = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

requests.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  if (sessionStorage.getItem("token")) {
    config.headers.token = sessionStorage.getItem("token") || "";
  }
  return config;
});

requests.interceptors.response.use(
  (res) => {
    const code: number = res.data.code || res.data.data.code;

    if (code != 200) {
      return Promise.reject(res.data.data.msg);
    }
    return Promise.resolve(res);
  },
  (err) => {
    console.log(err);
  }
);
