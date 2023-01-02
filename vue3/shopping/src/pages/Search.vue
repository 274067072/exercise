<template>
  <div class="container">
    <Dropdown />
    <div class="crumbs">
      <p>全部结果</p>
      <ul>
        <li v-show="categoryName">
          <span>{{ categoryName }}</span>
          <i @click="removeCategoryName()">x</i>
        </li>
        <li v-show="keyword">
          <span>{{ keyword }}</span>
          <i @click="removeKeyword()">x</i>
        </li>
        <li v-show="trademark.length">
          <span>{{ trademark.split(":")[1] }}</span>
          <i @click="removeTrademark()">x</i>
        </li>
        <li v-for="item in reactiveProps" :key="item">
          <span>{{ item.split(":")[1] }}</span>
          <i @click="removeProps(item)">x</i>
        </li>
      </ul>
    </div>
    <SearchSelect
      :trademarkList="trademarkList"
      :attrsList="attrsList"
      @addTrademark="addTrademark"
      @addProps="addProps"
    />
    <div class="order">
      <div
        :class="{ current: isComp }"
        data-orderType="comp"
        @click="changeOrder($event)"
      >
        综合<span v-show="isComp"
          ><span class="desc" v-show="isDesc" data-orderType="comp">↓</span
          ><span class="esc" v-show="!isDesc" data-orderType="comp"
            >↑</span
          ></span
        >
      </div>
      <div
        :class="{ current: !isComp }"
        data-orderType="price"
        @click="changeOrder($event)"
      >
        价格<span v-show="!isComp"
          ><span class="desc" v-show="isDesc" data-orderType="price">↓</span
          ><span class="esc" v-show="!isDesc" data-orderType="price"
            >↑</span
          ></span
        >
      </div>
    </div>
    <div class="content">
      <ul>
        <li v-for="good in goodsList" :key="good.id" @click="toDtail(good.id)">
          <img :src="good.defaultImg" />
          <p class="tittle">
            <a href="javascipt:;">{{ good.title }}</a>
          </p>
          <p class="price">￥{{ good.price }}</p>
        </li>
      </ul>
    </div>
    <div class="blank"></div>
    <Pagenation
      :continues="5"
      :pageNo="pageNo"
      :totalPages="totalPages"
      @changePageNo="changePageNo"
    />
  </div>
</template>

<script>
import { watch, computed, ref } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SearchSelect from "@/components/SearchSelect.vue";
import Pagenation from "@/components/Pagenation.vue";
export default {
  name: "Search",
  components: {
    SearchSelect,
    Pagenation,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const categoryName = ref("");
    const keyword = ref("");
    const trademark = ref(
      JSON.parse(sessionStorage.getItem("trademark")) || ""
    );
    let props = JSON.parse(sessionStorage.getItem("props")) || [];
    const reactiveProps = ref([]);
    const order = ref(JSON.parse(sessionStorage.getItem("order")) || "1:desc");
    const pageNo = ref(JSON.parse(sessionStorage.getItem("pageNo")) || 1);

    const attrsList = computed(() => store.getters.attrsList);
    const goodsList = computed(() => store.getters.goodsList);
    const trademarkList = computed(() => store.getters.trademarkList);
    const isComp = computed(() => order.value.split(":")[0] === "1");
    const isDesc = computed(() => order.value.split(":")[1] === "desc");
    const totalPages = computed(() => {
      return store.getters.totalPages;
    });
    function getList() {
      const defaultParams = {
        category1Id: undefined,
        category2Id: undefined,
        category3Id: undefined,
        categoryName: undefined,
        keyword: undefined,
        order: undefined,
        pageNo: undefined,
        pageSize: 10,
        props: undefined,
        trademark: undefined,
      };
      const params = route.params;
      const query = route.query;
      store.dispatch(
        "getSearchList",
        Object.assign(
          defaultParams,
          params,
          query,
          {
            trademark: trademark.value,
          },
          { props },
          { order: order.value },
          { pageNo: pageNo.value }
        )
      );
      categoryName.value = defaultParams.categoryName;
      keyword.value = defaultParams.keyword;
      reactiveProps.value = props;
    }
    watch(
      route,
      () => {
        getList();
      },
      { immediate: true }
    );
    function removeCategoryName() {
      pageNo.value = 1;
      router.push({ name: "search", params: route.params });
    }
    function removeKeyword() {
      pageNo.value = 1;
      router.push({ name: "search", query: route.query });
    }
    function addTrademark(id, value) {
      trademark.value = `${id}:${value}`;

      sessionStorage.setItem("trademark", JSON.stringify(trademark.value));
      pageNo.value = 1;
      getList();
    }
    function removeTrademark() {
      trademark.value = "";
      sessionStorage.setItem("trademark", JSON.stringify(trademark.value));
      pageNo.value = 1;
      getList();
    }

    function addProps(id, value, title) {
      props.push(`${id}:${value}:${title}`);
      sessionStorage.setItem("props", JSON.stringify(props));
      pageNo.value = 1;
      getList();
    }

    function removeProps(item) {
      props = props.filter((value) => {
        return value !== item;
      });

      sessionStorage.setItem("props", JSON.stringify(props));
      pageNo.value = 1;
      getList();
    }

    function changeOrder(e) {
      if (e.target.dataset.ordertype === "comp") {
        order.value = order.value === "1:desc" ? "1:asc" : "1:desc";
      } else if (e.target.dataset.ordertype === "price") {
        order.value = order.value === "2:desc" ? "2:asc" : "2:desc";
      }

      sessionStorage.setItem("order", JSON.stringify(order.value));
      pageNo.value = 1;
      getList();
    }

    function changePageNo(newPageNo) {
      pageNo.value = newPageNo;
      sessionStorage.setItem("pageNo", JSON.stringify(pageNo.value));
      getList();
    }

    function toDtail(id) {
      router.push({ name: "detail", params: { id } });
    }
    onBeforeRouteLeave(() => {
      sessionStorage.clear();
    });
    return {
      attrsList,
      goodsList,
      trademarkList,
      categoryName,
      keyword,
      trademark,
      reactiveProps,
      isDesc,
      isComp,
      pageNo,
      totalPages,
      removeCategoryName,
      removeKeyword,
      addTrademark,
      removeTrademark,
      addProps,
      removeProps,
      changeOrder,
      changePageNo,
      toDtail,
    };
  },
};
</script>

<style scoped lang="less">
.container {
  display: table;
  position: relative;
  .crumbs {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
    p {
      color: #666;
    }
    ul {
      display: flex;
      li {
        position: relative;
        border: 1px solid #c9c9c9;
        margin-left: 10px;
        line-height: 25px;
        &:hover {
          color: rgb(69, 139, 200);
        }
        span {
          padding: 0 10px;
        }
        i {
          padding-right: 10px;
          font-style: normal;
          cursor: pointer;
        }
      }
    }
  }
  .order {
    display: flex;
    height: 40px;
    margin: 20px 0;
    border: 1px solid #c9c9c9;
    background-color: #efefef;
    line-height: 40px;
    div {
      width: 80px;
      color: #666;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
    }
    .current {
      background-color: #c81623;
      color: #fff;
    }
  }
  .content {
    ul {
      display: flex;
      flex-wrap: wrap;
      margin: 0 auto;
      li {
        width: 234px;
        padding: 15px;
        border: 1px solid #c81623;
        margin: 3px 3px;
        line-height: 25px;
        cursor: pointer;
        img {
          display: block;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        .tittle {
          font-size: 14px;
          display: -webkit-box;

          -webkit-box-orient: vertical;

          -webkit-line-clamp: 2;

          overflow: hidden;
        }
        .price {
          font-size: 18px;
          line-height: 40px;
          font-weight: 700;
          color: #c81623;
        }
      }
    }
  }
  .blank {
    height: 70px;
  }
}
</style>
