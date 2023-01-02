import { createWebHashHistory, createRouter } from "vue-router";
import store from "@/vuex";

import routes from "./routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token;
  const userInfo = store.state.user.userInfo;
  if (token) {
    if (to.path == "/login") {
      next("/home");
    } else {
      if (!userInfo.nickName) {
        try {
          await store.dispatch("getUserInfo");
        } catch (error) {
          alert(error);
        }
      }
      next();
    }
  } else {
    if (
      to.path.indexOf("/pay") != -1 ||
      to.path.indexOf("/trade") != -1 ||
      to.path.indexOf("/center") != -1
    ) {
      next(`/login?redirect=${to.path}`);
    } else {
      next();
    }
  }
});
export default router;
