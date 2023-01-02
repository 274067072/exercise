<template>
  <div class="container">
    <div class="title">注册</div>
    <div class="form">
      <div class="left">
        <p>手机：</p>
        <p>验证码：</p>
        <p>密码：</p>
        <p>确认密码：</p>
      </div>
      <div class="right">
        <div>
          <input name="phone" v-model="phone" /><span class="error">{{
            errorMessage1
          }}</span>
        </div>
        <div>
          <input name="code" v-model="code" /><button @click="getCode()">
            获取验证码</button
          ><span class="error code_error">{{ errorMessage2 }}</span>
        </div>
        <div>
          <input name="password" v-model="password" /><span class="error">{{
            errorMessage3
          }}</span>
        </div>
        <div>
          <input name="password1" v-model="password1" /><span class="error">{{
            errorMessage4
          }}</span>
        </div>
      </div>
    </div>
    <button @click="regist()">注册</button>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useField } from "vee-validate";
export default {
  name: "Register",
  setup() {
    const store = useStore();
    const router = useRouter();
    const isPhone = (value) => {
      const reg_tel =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (reg_tel.test(value)) {
        return true;
      } else {
        return "手机号码不合法";
      }
    };
    const isCode = (value) => {
      const reg_tel = /^\d{6}$/;
      if (reg_tel.test(value)) {
        return true;
      } else {
        return "验证码不合法";
      }
    };
    const isPwd = (value) => (value ? true : "请输入密码");
    const isPwd1 = (value) => {
      if (value == password.value) {
        return true;
      } else {
        return "密码不一致";
      }
    };
    const { value: phone, errorMessage: errorMessage1 } = useField(
      "phone",
      isPhone
    );
    const { value: code, errorMessage: errorMessage2 } = useField(
      "code",
      isCode
    );
    const { value: password, errorMessage: errorMessage3 } = useField(
      "code",
      isPwd
    );
    const { value: password1, errorMessage: errorMessage4 } = useField(
      "code",
      isPwd1
    );
    async function getCode() {
      try {
        if (phone.value && !errorMessage1.value) {
          await store.dispatch("getCode", phone.value);
          code.value = store.state.user.code;
        } else {
          alert("请输入正确的手机号");
        }
      } catch (error) {
        alert(error);
      }
    }
    async function regist() {
      try {
        if (
          phone.value &&
          code.value &&
          password.value &&
          !errorMessage1.value &&
          !errorMessage2.value &&
          !errorMessage3.value &&
          !errorMessage4.value
        ) {
          await store.dispatch("regist", {
            phone: phone.value,
            code: code.value,
            password: password.value,
          });
          router.push("/login");
        } else {
          alert("请完善注册信息");
        }
      } catch (error) {
        alert(error);
      }
    }
    return {
      errorMessage1,
      errorMessage2,
      errorMessage3,
      errorMessage4,
      phone,
      code,
      password,
      password1,
      getCode,
      regist,
    };
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
    width: 300px;
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
      position: relative;
      div {
        position: relative;
        input {
          display: block;
          width: 200px;
          height: 25px;
          margin: 20px 0;
        }
        .error {
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(100%+10px);
          color: #c81623;
          line-height: 25px;
        }
        .code_error {
          transform: translateX(100%+162px);
        }
      }
      button {
        position: absolute;
        top: -10px;
        right: -110px;
        height: 25px;
        font-size: 14px;
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
