<template>
  <div class="w">
    <div class="container">
      <p>支付成功！</p>
      <div class="button">
        <button @click="toHome()">继续购物</button>
        <button @click="toMyOrder()">查看订单详情</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name: "PaySuccess",
  setup() {
    const router = useRouter();
    function toHome() {
      router.push("/");
    }
    function toMyOrder() {
      router.push("/center/myorder");
    }
    return { toHome, toMyOrder };
  },
};
</script>

<style scoped lang="less">
.w {
  background-color: #efefef;
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    p {
      font-size: 18px;
    }
    .button {
      display: flex;
      button {
        width: 100px;
        height: 30px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
