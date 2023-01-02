<template>
  <a-layout class="layout-demo">
    <a-layout-sider hide-trigger collapsible :collapsed="collapsed">
      <div class="logo" />
      <a-menu :style="{ width: '100%' }" @menuItemClick="onClickMenuItem">
        <a-menu-item key="0_1" disabled>
          <IconHome />
          首页
        </a-menu-item>
        <a-menu-item key="0_2" ref="goods">
          <IconCalendar />
          商品列表
        </a-menu-item>
        <a-menu-item key="0_3" ref="user">
          <IconCalendar />
          用户列表
        </a-menu-item>
        <a-menu-item key="0_4" ref="role">
          <IconCalendar />
          角色列表
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="padding-left: 20px">
        <div class="title">
          <a-button shape="round" @click="onCollapse">
            <IconCaretRight v-if="collapsed" />
            <IconCaretLeft v-else />
          </a-button>
          <h2>后台管理系统</h2>
          <a-space>
            <a-link class="logout" @click="logout" :hoverable="false"
              >退出登录</a-link
            >
          </a-space>
        </div>
      </a-layout-header>
      <a-layout style="padding: 0 24px">
        <a-breadcrumb :style="{ margin: '16px 0' }">
          <a-breadcrumb-item>后台管理系统</a-breadcrumb-item>
          <a-breadcrumb-item>{{ listName }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content class="layout_content">
          <router-view />
        </a-layout-content>
        <a-layout-footer>Footer</a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import {
  IconCaretRight,
  IconCaretLeft,
  IconHome,
  IconCalendar,
} from "@arco-design/web-vue/es/icon";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const goods = ref();
const user = ref();
const role = ref();
const isHome = computed(() => route.name == "home");
const listName = computed(() => {
  let name: string = "";
  switch (route.name) {
    case "home":
      name = "首页";
      break;
    case "goodslist":
      name = "商品列表";
      break;
    case "userlist":
      name = "用户列表";
      break;
    case "rolelist":
      name = "角色列表";
      break;
    case "moddify":
      name = "修改角色权限";
      break;
  }
  return name;
});
enum SubRoute {
  goods = "0_2",
  user = "0_3",
  role = "0_4",
}
const onCollapse = () => {
  collapsed.value = !collapsed.value;
};
onMounted(() => {
  setActive();
});
onUpdated(() => {
  setActive();
});
function setActive() {
  if (route.path.includes("goods")) {
    goods.value.refItemElement.click();
  } else if (route.path.includes("user")) {
    user.value.refItemElement.click();
  } else if (route.path.includes("role")) {
    role.value.refItemElement.click();
  }
}
function logout() {
  sessionStorage.removeItem("token");
  router.push("/login");
}
function onClickMenuItem(key: string) {
  switch (key) {
    case SubRoute.goods:
      router.push("/home/goods");
      break;
    case SubRoute.user:
      router.push("/home/user");
      break;
    case SubRoute.role:
      router.push("/home/role");
      break;
  }
}
</script>

<style scoped lang="less">
.layout-demo {
  height: 500px;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
}
.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  background: rgba(255, 255, 255, 0.2);
}
.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}
.layout-demo :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
}
.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}
.layout-demo :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}
.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}
.layout-demo {
  width: 100%;
  height: 100%;
  .logo {
    background: url("@/assets/img/1cd9bf3a00495e92eb256b2b4b67cad4.jpeg")
      no-repeat center !important;
    background-size: contain !important;
  }
  .title {
    position: relative;
    h2 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .logout {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
  }
  .layout_content {
    justify-content: start;
  }
}
</style>
