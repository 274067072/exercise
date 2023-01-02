<template>
  <div class="container">
    <div class="all">全部商品</div>
    <div class="title">
      <p>全部</p>
      <p>商品</p>
      <p>单价（元）</p>
      <p>数量</p>
      <p>小计（元）</p>
      <p>操作</p>
    </div>
    <div class="content">
      <ul>
        <li v-for="product in cartInfoList" :key="product.skuId">
          <div class="input">
            <input
              type="checkbox"
              :checked="product.isChecked"
              @click="changeCheck(product.skuId, product.isChecked)"
            />
          </div>
          <div class="product">
            <img :src="product.imgUrl" />
            <div class="name">{{ product.skuName }}</div>
          </div>
          <div class="price">{{ product.skuPrice }}</div>
          <div class="num">
            <button @click="changeNum(product.skuId, '-', product.skuNum)">
              -
            </button>
            <input
              type="text"
              :value="product.skuNum"
              @blur="blur($event, product.skuId, product.skuNum)"
            />
            <button @click="changeNum(product.skuId, '+', product.skuNum)">
              +
            </button>
          </div>
          <div class="cal">{{ product.skuNum * product.skuPrice }}</div>
          <div class="handle">
            <p @click="deleteProduct(product.skuId)">删除</p>
            <p>移至收藏</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="left">
        <div class="check">
          <input
            type="checkbox"
            :checked="isAllChecked && cartInfoList.length"
            :disabled="!cartInfoList.length"
            @click="changeAllCheckState(isAllChecked)"
          />
          <p>全选</p>
          <div class="del_check" @click="deleteAllcheckedProduct()">
            删除选中商品
          </div>
        </div>
        <div class="total">
          <p>
            已选择<span>{{ checkedNum }}</span
            >件商品
          </p>
          <p>总价（不含运费）：</p>
          <p class="total_price">{{ sum }}</p>
        </div>
      </div>
      <div class="right" @click="toTrade()">结算</div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import throttle from "lodash/throttle";
import { useRouter } from "vue-router";
export default {
  name: "Shopcar",
  setup() {
    const store = useStore();
    const router = useRouter();
    const cartInfoList = computed(() => {
      return store.getters.cartInfoList;
    });
    const sum = computed(() => {
      let sum = 0;
      cartInfoList.value.forEach((element) => {
        if (element.isChecked) {
          sum += element.skuNum * element.skuPrice;
        }
      });
      return sum;
    });
    const isAllChecked = computed(() => {
      return cartInfoList.value.every((element) => element.isChecked == 1);
    });
    const checkedNum = computed(() => {
      let num = 0;
      cartInfoList.value.forEach((element) => {
        if (element.isChecked) {
          num += 1;
        }
      });
      return num;
    });
    onMounted(() => {
      store.dispatch("getShopcarList");
    });
    async function update(id, num) {
      try {
        await store.dispatch("addOrUpdateShopCart", { id, num });
      } catch (error) {
        console.log(error.message);
      }
      store.dispatch("getShopcarList");
    }
    async function deleteProduct(id) {
      try {
        await store.dispatch("deleteProduct", id);
      } catch (error) {
        console.log(error.message);
      }
      store.dispatch("getShopcarList");
    }
    const changeNum = throttle((id, math, num) => {
      if (math == "+") {
        update(id, 1);
      } else {
        if (num <= 1) {
          deleteProduct(id);
        } else {
          update(id, -1);
        }
      }
    }, 1000);
    function blur(e, id, num) {
      const input = e.target.value;
      if (Object.is(input * 1, NaN)) {
        e.target.value = num;
      } else if (input < 0) {
        deleteProduct(id);
      } else {
        num = parseInt(input) - num;
        update(id, num);
      }
    }
    async function changeCheck(id, isChecked) {
      try {
        isChecked = isChecked == 0 ? 1 : 0;
        await store.dispatch("updateCheck", { id, isChecked });
      } catch (error) {
        console.log(error.message);
      }
      store.dispatch("getShopcarList");
    }
    async function deleteAllcheckedProduct() {
      try {
        await store.dispatch("deleteAllcheckedProduct");
      } catch (error) {
        console.log(error.message);
      }
      store.dispatch("getShopcarList");
    }
    async function changeAllCheckState(isAllChecked) {
      const isChecked = isAllChecked == true ? 0 : 1;
      try {
        await store.dispatch("changeAllCheckState", isChecked);
      } catch (error) {
        console.log(error.message);
      }
      store.dispatch("getShopcarList");
    }
    function toTrade() {
      router.push("/trade");
    }
    return {
      cartInfoList,
      sum,
      isAllChecked,
      checkedNum,
      changeNum,
      blur,
      deleteProduct,
      changeCheck,
      deleteAllcheckedProduct,
      changeAllCheckState,
      toTrade,
    };
  },
};
</script>

<style scoped lang="less">
.all {
  margin: 20px 0 10px 0;
  font-size: 16px;
  font-weight: 700;
}
.title {
  display: flex;
  height: 30px;
  background-color: #efefef;
  border: 1px solid #c9c9c9;
  line-height: 30px;
  text-align: center;
  p {
    &:first-child {
      width: 40px;
    }
    &:nth-child(2) {
      width: 500px;
    }
    &:nth-child(3) {
      width: 100px;
    }
    &:nth-child(4) {
      width: 200px;
    }
    &:nth-child(5) {
      width: 200px;
    }
    &:nth-child(6) {
      width: 100px;
    }
  }
}
.content {
  border: 1px solid #c9c9c9;
  margin: 10px 0;
  ul {
    li {
      display: flex;
      align-items: center;
      height: 100px;
      text-align: center;
      .input {
        width: 40px;
        input {
          cursor: pointer;
        }
      }
      .product {
        display: flex;
        justify-content: center;
        width: 400px;
        margin: 0 50px;
        img {
          width: 80px;
          height: 80px;
          border: 1px solid #c9c9c9;
          margin-right: 10px;
          cursor: pointer;
        }
        .name {
          line-height: 20px;
          text-align: left;
        }
      }
      .price {
        width: 100px;
      }
      .num {
        width: 200px;
        input {
          width: 40px;
          height: 40px;
          border: 1px solid #c9c9c9;
          border-left: none;
          border-right: none;
          outline: none;
          text-align: center;
        }
        button {
          width: 20px;
          height: 40px;
          border: 1px solid #c9c9c9;
          background-color: #fff;
          cursor: pointer;
        }
      }
      .cal {
        width: 200px;
      }
      .handle {
        width: 100px;
        text-align: left;
        p {
          margin: 10px 0 10px 35px;
          cursor: pointer;
        }
      }
    }
  }
}
.footer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .left {
    flex: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    border: 1px solid #c9c9c9;
    border-right: none;
    font-size: 14px;
    .check {
      display: flex;
      align-items: center;
      margin-left: 13px;
      input {
        cursor: pointer;
        margin-right: 5px;
      }
      .del_check {
        margin-left: 20px;
        cursor: pointer;
      }
    }
    .total {
      display: flex;
      align-items: center;
      margin-right: 13px;
      p {
        &:first-child {
          margin-right: 20px;
        }
        &:last-child {
          margin-right: 50px;
        }
      }
      .total_price {
        font-size: 18px;
        color: #c81623;
      }
    }
  }
  .right {
    flex: 1;
    height: 50px;
    background-color: #c81623;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
}
</style>
