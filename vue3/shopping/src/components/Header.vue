<template>
  <div class="shortcut">
    <div class="container">
      <div class="left">
        品优购欢迎您!
        <span @click="toLogin()" v-if="!userInfo.nickName">请登录</span>
        <span class="red" @click="toRegister()" v-if="!userInfo.nickName"
          >免费注册</span
        >
        <span v-if="userInfo.nickName">{{ userInfo.nickName }}</span>
        <span class="red" v-if="userInfo.nickName" @click="logout()"
          >退出登录</span
        >
      </div>
      <div class="right">
        <ul>
          <li><router-link to="/center/myorder">我的订单</router-link></li>
          <li><router-link to="/shopcar"> 我的购物车</router-link></li>
          <li><a href="javascript:;"> 品优购会员</a></li>
          <li><a href="javascript:;">企业采购</a></li>
          <li><a href="javascript:;">关注品优购</a></li>
          <li><a href="javascript:;">客户服务</a></li>
          <li><a href="javascript:;"> 网站导航</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="search container">
    <div class="logo">
      <h1><router-link to="/home" title="品优购">品优购</router-link></h1>
    </div>
    <div class="searchBar">
      <input
        type="text"
        placeholder="输入您想要的商品"
        v-model="keyword"
        @keyup.enter="search()"
      />
      <button @click="search()">搜索</button>
    </div>
  </div>
  <div class="nav" v-show="isShowNav">
    <div class="container">
      <div class="navItems">
        <ul>
          <li v-for="(item, index) in navItemsArr" :key="index">
            <a href="javascript:;">{{ item }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { readonly } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import combineArgu from "@/hooks/combineArgu";
import { useStore } from "vuex";
import { RouterLink } from "vue-router";
export default {
  name: "Header",
  components: { RouterLink },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const navItemsArr = readonly([
      "服装城",
      "美妆馆",
      "传智超市",
      "全球购",
      "闪购",
      "团购",
      "拍卖",
      "有趣",
    ]);
    const keyword = ref("");
    const isShowNav = ref(true);
    const userInfo = computed(() => {
      return store.state.user.userInfo;
    });
    watch(route, () => {
      keyword.value = route.params.keyword;
      if (
        route.path == "/shopcar" ||
        route.path == "/login" ||
        route.path == "/register" ||
        route.path == "/trade" ||
        route.path == "/pay" ||
        route.path == "/paysuccess" ||
        route.path == "/center" ||
        route.path == "/center/myorder"
      ) {
        isShowNav.value = false;
      } else {
        isShowNav.value = true;
      }
    });
    function search() {
      const location = combineArgu(route, "search", keyword.value);
      router.push(location);
    }
    function toLogin() {
      router.push("/login");
    }
    function toRegister() {
      router.push("/register");
    }
    async function logout() {
      try {
        await store.dispatch("logout");
      } catch (error) {
        alert(error);
      }
    }
    return {
      navItemsArr,
      keyword,
      isShowNav,
      userInfo,
      search,
      toLogin,
      toRegister,
      logout,
    };
  },
};
</script>

<style scoped lang="less">
.shortcut {
  width: 100%;
  height: 30px;
  background-color: #f1f1f1;
  color: #666;
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    .left {
      span {
        cursor: pointer;
        &:first-child {
          padding: 0 13px;
        }
      }
    }
    .right {
      ul {
        display: flex;
        li {
          padding: 0 14px;
          border-right: 1px solid #666;
          &:last-child {
            padding-right: 0;
            border: none;
          }
        }
      }
    }
  }
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 106px;
  .logo {
    a {
      display: block;
      width: 171px;
      height: 61px;
      background: url("@/assets/41662616538_.pic.jpg") no-repeat center;
      font-size: 0;
      z-index: -999px;
    }
  }
  .searchBar {
    display: flex;
    width: 534px;
    height: 36px;
    border: 2px solid #b1191a;
    input {
      width: 454px;
      height: 100%;
      border: none;
      text-indent: 1em;
      outline: none;
    }
    button {
      width: 80px;
      height: 100%;
      background-color: #b1191a;
      color: #fff;
      font-size: 16px;
      text-align: center;
      border: none;
      cursor: pointer;
    }
  }
}
.nav {
  border-bottom: 2px solid #b1191a;
  .container {
    display: flex;
    align-items: center;
    height: 45px;
    .navItems {
      ul {
        display: flex;
        margin-left: 218px;
        a {
          margin: 0 26px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
