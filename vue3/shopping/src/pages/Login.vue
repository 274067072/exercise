<template>
  <div class="container">
    <div class="title">登录</div>
    <div class="form">
      <div class="left">
        <p>电话：</p>
        <p>密码：</p>
      </div>
      <div class="right">
        <input type="text" v-model="phone" /><input
          type="password"
          v-model="password"
        />
      </div>
    </div>
    <button @click="login()">登录</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "Login",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const phone = ref("");
    const password = ref("");
    async function login() {
      try {
        if (phone.value && password.value) {
          await store.dispatch("login", {
            phone: phone.value,
            password: password.value,
          });
        }
      } catch (error) {
        alert(error);
      }
      if (route.query.redirect) {
        router.push(`${route.query.redirect}`);
      } else {
        router.push("/home");
      }
    }
    return { phone, password, login };
  },
};
</script>

<style scoped lang="less">
.container {
  border: 1px solid #c9c9c9;
  .title {
    height: 50px;
    background-color: #efefef;
    font-size: 18px;
    text-align: center;
    line-height: 50px;
  }
  .form {
    display: flex;
    width: 260px;
    margin: 40px auto 0 auto;
    .left {
      p {
        width: 60px;
        margin: 20px 0;
        line-height: 25px;
        text-align: right;
      }
    }
    .right {
      input {
        display: block;
        width: 200px;
        height: 25px;
        margin: 20px 0;
      }
    }
  }
  button {
    display: block;
    width: 100px;
    height: 30px;
    margin: 10px auto 50px auto;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
