<template>
  <div class="container">
    <div class="form">
      <h2>后台管理系统</h2>
      <a-form
        :model="form"
        :style="{ width: '500px' }"
        @submit="handleSubmit"
        ref="formEle"
      >
        <a-form-item
          field="username"
          label="用户名"
          :rules="[
            { required: true, message: '用户名不能为空' },
            { minLength: 5, message: '用户名必须大于等于5个字符' },
          ]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          feedback
          class="label"
        >
          <a-input v-model="form.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item
          field="password"
          label="密码"
          :rules="[
            { required: true, message: '密码不能为空' },
            { minLength: 5, message: '密码必须大于等于5个字符' },
          ]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          class="label"
        >
          <a-input-password v-model="form.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" class="button" ref="button"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { reqLogin } from "@/axios/index";
import { useRouter } from "vue-router";
const router = useRouter();
const layout = ref("horizontal");
const form = reactive({
  username: "",
  password: "",
});
const formEle = ref();
const button = ref();
async function handleSubmit(values: Record<string, any>): Promise<void> {
  if (!formEle.value || !button.value) {
    return;
  }
  const err = await formEle.value.validate();
  if (err) {
    return;
  }
  try {
    const res = await reqLogin({
      username: values.values.username,
      password: values.values.password,
    });
    const token: string = res.data.data.token;
    sessionStorage.setItem("token", token);
    router.push("/");
  } catch (error) {
    button.value.$message.error(error);
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("@/assets/img/2ebfc09d56ffa1ac92d8dd77eeeb54ff.jpeg")
    no-repeat fixed top left;
  h2 {
    margin-bottom: 20px;
    text-align: center;
  }
  .form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;
    background-color: rgba(256, 256, 256, 0.5);
    border-radius: 10px;
    .label {
      &:deep(label) {
        color: #333;
      }
      &:deep(.arco-input-wrapper) {
        background-color: rgba(256, 256, 256, 0.9);
      }
    }
    .button {
      margin-left: 120px;
    }
  }
}
</style>
