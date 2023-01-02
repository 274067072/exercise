<template>
  <div class="container">
    <h3>填写并核对订单信息</h3>
    <div class="w">
      <div class="address_list">
        <h4>收件人信息</h4>
        <ul>
          <li
            v-for="address in addressList"
            :key="address.id"
            @click="changeDefault(address.id)"
          >
            <div class="name" :class="{ current: address.isDefault == 1 }">
              {{ address.consignee }}
            </div>
            <div class="address">{{ address.fullAddress }}</div>
            <div class="default" v-show="address.isDefault == 1">默认地址</div>
          </li>
        </ul>
      </div>
      <div class="order_list">
        <h4>送货清单</h4>
        <ul>
          <li>
            <h4>商品清单</h4>
          </li>
          <li v-for="detail in detailList" :key="detail.skuId">
            <img :src="detail.imgUrl" />
            <div class="info">
              <div class="name">{{ detail.skuName }}</div>
              <div class="label">7天无理由退货</div>
            </div>
            <div class="price">￥{{ detail.orderPrice }}</div>
            <div class="num">x{{ detail.skuNum }}</div>
            <div class="state">有货</div>
          </li>
        </ul>
      </div>
      <div class="comment">
        <h4>买家留言：</h4>
        <textarea @blur="saveComment($event)" />
      </div>
    </div>
    <div class="sum">
      <p>
        {{ orderInfo.totalNum }}件商品，总商品金额<span
          >￥{{ orderInfo.originalTotalAmount }}</span
        >
      </p>
      <p>
        <span>收货人：{{ pickedAddress.consignee }}</span
        ><span>电话：{{ pickedAddress.phoneNum }}</span
        ><span>地址：{{ pickedAddress.fullAddress }}</span>
      </p>
    </div>
    <div class="pay">
      <p>
        应付金额：<span>￥{{ orderInfo.totalAmount }}</span>
      </p>
    </div>
    <button @click="toPay()">结算</button>
    <div class="blank"></div>
  </div>
</template>

<script>
import { computed, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "Trade",
  setup() {
    const store = useStore();
    const router = useRouter();
    let comment = "";
    const orderInfo = computed(() => {
      return store.state.trade.orderInfo || {};
    });
    const addressList = computed(() => {
      return store.getters.addressList || [];
    });
    const detailList = computed(() => {
      return store.getters.detailList;
    });
    const pickedAddress = computed(() => {
      return (
        addressList.value.find((element) => {
          return element.isDefault == 1;
        }) || {}
      );
    });
    const tradeNo = computed(() => orderInfo.value.tradeNo);
    onMounted(() => {
      store.dispatch("getOrderInfo");
    });
    function changeDefault(id) {
      addressList.value.forEach((element) => {
        element.isDefault = element.id == id ? 1 : 0;
      });
    }
    function saveComment(e) {
      comment = e.target.value;
    }
    async function toPay() {
      const data = {
        consignee: pickedAddress.value.consignee,
        consigneeTel: pickedAddress.value.phoneNum,
        deliveryAddress: pickedAddress.value.fullAddress,
        paymentWay: "ONLINE",
        orderComment: comment,
        orderDetailList: JSON.parse(JSON.stringify(detailList.value)),
      };
      try {
        await store.dispatch("submitOrder", { tradeNo: tradeNo.value, data });
      } catch (error) {
        alert(error);
      }
      const orderId = store.state.trade.orderId;
      router.push({ path: "/pay", query: { orderId } });
    }
    return {
      orderInfo,
      addressList,
      detailList,
      pickedAddress,
      changeDefault,
      saveComment,
      toPay,
    };
  },
};
</script>

<style scoped lang="less">
.container {
  position: relative;
  h3 {
    margin: 30px 0 10px 0;
  }
  .w {
    padding: 0 20px;
    border: 1px solid #c9c9c9;
    .address_list {
      margin-top: 50px;
      border-bottom: 1px solid #c9c9c9;
      h4 {
        margin-bottom: 20px;
      }
      ul {
        padding-left: 30px;
        li {
          display: flex;
          margin: 15px 0;
          align-items: center;
          font-size: 14px;
          cursor: pointer;
          .name {
            width: 100px;
            height: 30px;
            border: 1px solid #c9c9c9;
            border-radius: 5px;
            text-align: center;
            line-height: 30px;
          }
          .current {
            border-color: #c81623;
          }
          .address {
            margin: 0 15px;
          }
          .default {
            padding: 5px;
            background-color: #999;
            color: #fff;
          }
        }
      }
    }
    .order_list {
      margin-top: 20px;
      padding-bottom: 20px;
      h4 {
        margin-bottom: 20px;
      }
      ul {
        padding: 25px 15px;
        margin: 0 30px;
        background-color: rgb(255, 232, 232);
        li {
          display: flex;
          padding: 10px 0;
          line-height: 25px;
          h4 {
            margin: 0;
          }
          img {
            width: 80px;
            height: 80px;
          }
          .info {
            position: relative;
            width: 500px;
            margin: 0 100px;
            .label {
              position: absolute;
              bottom: 0;
              left: 0;
              color: #c81623;
            }
          }
          .price {
            width: 100px;
            color: #c81623;
            font-size: 14px;
            font-weight: 700;
            text-align: center;
          }
          .num {
            width: 100px;
            text-align: center;
          }
          .state {
            width: 100px;
            text-align: center;
          }
        }
      }
    }
    .comment {
      textarea {
        width: 1098px;
        height: 50px;
        margin: 10px 30px;
        outline: none;
        resize: none;
        line-height: 20px;
      }
    }
  }
  .sum {
    p {
      text-align: right;
      line-height: 40px;
      span {
        margin-left: 30px;
      }
    }
  }
  .pay {
    height: 50px;
    background-color: #efefef;
    border: 1px solid #c9c9c9;
    line-height: 50px;
    text-align: right;
    span {
      padding-right: 10px;
      font-size: 16px;
      font-weight: 700;
      color: #c81623;
    }
  }
  button {
    position: absolute;
    right: 0;
    bottom: 40px;
    width: 100px;
    height: 40px;
    border: none;
    background-color: #c81623;
    font-size: 18px;
    color: #fff;
    cursor: pointer;
  }
  .blank {
    height: 100px;
  }
}
</style>
