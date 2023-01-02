<template>
  <div class="title">
    <p>商品</p>
    <p>订单详情</p>
    <p>收货人</p>
    <p>金额</p>
    <p>状态</p>
    <p>操作</p>
  </div>
  <table v-for="record in records" :key="record.id">
    <thead>
      <tr>
        <td colspan="5">
          <div class="head">
            <h4>{{ record.createTime }}</h4>
            <h4>订单编号：{{ record.outTradeNo }}</h4>
          </div>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in record.orderDetailList" :key="order.id">
        <td>
          <div class="detail">
            <img :src="order.imgUrl" />
            <div class="name">{{ order.skuName }}</div>
            <div class="num">x{{ order.skuNum }}</div>
            <p>售后申请</p>
          </div>
        </td>
        <td>{{ record.consignee }}</td>
        <td>总金额￥{{ record.totalAmount }}<br/>{{ record.paymentWay }}</td>
        <td>{{ record.orderStatusName }}</td>
        <td>评价 <span>|</span> 晒单</td>
      </tr>
    </tbody>
  </table>
  <pagenation
    :continues="5"
    :pageNo="pageNo"
    :totalPages="totalPages"
    @changePageNo="changePageNo"
  />
</template>

<script>
import { computed, onMounted, ref } from "vue-demi";
import { useStore } from "vuex";
import Pagenation from "@/components/Pagenation.vue";
export default {
  name: "MyOrder",
  components: { Pagenation },
  setup() {
    const store = useStore();
    const pageNo = ref(JSON.parse(sessionStorage.getItem("page")) || 1);
    const limit = 3;
    const totalPages = computed(() => store.state.center.orderInfo.pages);
    const records = computed(() => store.getters.records);
    onMounted(() => {
      store.dispatch("getMyOrder", { page: pageNo.value, limit });
    });
    function changePageNo(newPageNo) {
      pageNo.value = newPageNo;
      sessionStorage.setItem("pageNo", JSON.stringify(pageNo.value));
      store.dispatch("getMyOrder", { page: pageNo.value, limit });
    }
    return { records, pageNo, totalPages, changePageNo };
  },
};
</script>

<style scoped lang="less">
.title {
  display: flex;
  background-color: #efefef;
  border: 1px solid #c9c9c9;
  p {
    flex: 1;
    text-align: center;
    line-height: 30px;
    font-weight: 700;
    color: #333;
    &:nth-child(2) {
      flex: 4;
    }
  }
}
table {
  border-collapse: collapse;
  margin: 15px 0;
  thead {
    tr {
      height: 30px;
      background-color: #efefef;
      border: 1px solid #c9c9c9;
      line-height: 30px;
      td {
        .head {
          display: flex;
          text-align: center;
          h4 {
            margin: 0 5px;
          }
        }
      }
    }
  }
  tbody {
    tr {
      td {
        text-align: center;
        &:first-child {
          text-align: left;
          width: 485px;
        }
        &:nth-child(2) {
          width: 75px;
        }
        &:nth-child(3) {
          width: 120px;
        }
        &:nth-child(4) {
          width: 70px;
        }
        .detail {
          display: flex;
          align-items: center;
          img {
            width: 100px;
            height: 100px;
          }
          .name {
            width: 280px;
            margin: 0 10px;
          }
          .num {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
