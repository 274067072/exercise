import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

export const mockRequests = axios.create({
  baseURL: "/mock",
  timeout: 5000,
});

mockRequests.interceptors.request.use((config) => {
  nprogress.start();
  return config;
});
mockRequests.interceptors.response.use(
  (res) => {
    nprogress.done();
    return Promise.resolve(res.data);
  },
  (err) => {
    return Promise.reject(new Error(err.message));
  }
);
