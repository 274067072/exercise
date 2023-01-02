import Home from "@/pages/Home.vue";
import Search from "@/pages/Search.vue";
import Register from "@/pages/Register.vue";
import Login from "@/pages/Login.vue";
import Detail from "@/pages/Detail.vue";
import AddCartSuccessVue from "@/pages/AddCartSuccess.vue";
import Shopcar from "@/pages/Shopcar.vue";
import Trade from "@/pages/Trade.vue";
import Pay from "@/pages/Pay.vue";
import PaySuccess from "@/pages/PaySuccess.vue";
import Center from "@/pages/Center.vue";
import MyOrder from "@/pages/MyOrder.vue";

export default [
  { path: "/home", component: Home, meta: { isShowFooter: true } },
  {
    path: "/search/:keyword?",
    name: "search",
    component: Search,
    meta: { isShowFooter: true },
  },
  { path: "/register", component: Register, meta: { isShowFooter: false } },
  { path: "/login", component: Login, meta: { isShowFooter: false } },
  {
    path: "/detail/:id",
    name: "detail",
    component: Detail,
    meta: { isShowFooter: true },
  },
  {
    path: "/addcartsuccess",
    component: AddCartSuccessVue,
    meta: { isShowFooter: true },
  },
  {
    path: "/shopcar",
    component: Shopcar,
    meta: { isShowFooter: true },
  },
  {
    path: "/trade",
    component: Trade,
    meta: { isShowFooter: false },
    beforeEnter(to, from, next) {
      if (from.path != "/shopcar" && from.path != "/pay") {
        next(false);
      } else {
        next();
      }
    },
  },
  {
    path: "/pay",
    component: Pay,
    meta: { isShowFooter: false },
    beforeEnter(to, from, next) {
      if (from.path != "/trade" && from.path != "/shoppaysuccesscar") {
        next(false);
      } else {
        next();
      }
    },
  },
  {
    path: "/paysuccess",
    component: PaySuccess,
    meta: { isShowFooter: false },
    beforeEnter(to, from, next) {
      if (from.path != "/pay") {
        next(false);
      } else {
        next();
      }
    },
  },
  {
    path: "/center",
    component: Center,
    meta: { isShowFooter: false },
    children: [
      {
        path: "myorder",
        component: MyOrder,
        meta: { isShowFooter: false },
      },
    ],
  },
  { path: "/", redirect: "/home" },
];
