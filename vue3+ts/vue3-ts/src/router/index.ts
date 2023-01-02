import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/LoginView.vue"),
    beforeEnter: (to, from, next) => {
      const token: string | null = sessionStorage.getItem("token");
      if (token) {
        next(from.path);
      } else {
        next();
      }
    },
  },
  {
    path: "/home",
    name: "home",
    redirect: "/home/goods",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/HomeView.vue"),
    children: [
      {
        path: "goods",
        name: "goodslist",
        component: () => import("@/views/GoodsListView.vue"),
      },
      {
        path: "user",
        name: "userlist",
        component: () => import("@/views/UserListView.vue"),
      },
      {
        path: "role",
        name: "rolelist",
        component: () => import("@/views/RoleListView.vue"),
      },
      {
        path: "moddify",
        name: "moddify",
        component: () => import("@/views/ModdifyView.vue"),
      },
    ],
  },
  {
    path: "/",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token: string | null = sessionStorage.getItem("token");
  if (!token && to.path != "/login") {
    next("/login");
  } else {
    next();
  }
});

export default router;
