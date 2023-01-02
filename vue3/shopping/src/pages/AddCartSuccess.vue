<template>
  <div class="container"><p class="success">加入购物车成功!</p></div>
  <div class="w">
    <div class="container">
      <img :src="skuInfo.skuDefaultImg" />
      <div class="content">
        <div class="name">{{ skuInfo.skuName }}</div>
        <div class="desc">
          <p>{{ skuInfo.skuDesc }}</p>
          <div class="num">数量：{{ num }}</div>
        </div>
        <div class="button">
          <button @click="toDetail()">查看商品详情</button>
          <button @click="toShopcar()">购物车</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
export default {
  name: "AddCartSuccess",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const skuInfo = JSON.parse(sessionStorage.getItem("skuInfo"));
    const num = route.query.num;
    function toDetail() {
      router.push({ name: "detail", params: { id: skuInfo.id } });
      // router.back()
    }
    function toShopcar() {
      router.push("/shopcar");
    }
    return { skuInfo, num, toDetail, toShopcar };
  },
};
</script>

<style scoped lang="less">
.success {
  font-size: 20px;
  color: green;
  margin: 15px 0;
}
.w {
  background-color: #efefef;
  .container {
    display: flex;
    img {
      width: 80px;
      height: 80px;
      border: 1px solid #c9c9c9;
    }
    .content {
      flex: 1;
      position: relative;
      line-height: 25px;
      .name {
        font-size: 16px;
      }
      .desc {
        display: flex;
        color: #666;
        p {
          margin-right: 10px;
        }
      }
      .button {
        position: absolute;
        right: 0;
        bottom: 5px;
        button {
          padding: 0 10px;
          margin-left: 5px;
          line-height: 20px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
