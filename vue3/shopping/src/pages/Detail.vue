<template>
  <div class="container">
    <Dropdown />
    <div class="catergory">
      <p v-if="categoryView.category1Id">{{ categoryView.category1Name }}</p>
      <span v-if="categoryView.category2Id">/</span>
      <p v-if="categoryView.category2Id">{{ categoryView.category2Name }}</p>
      <span v-if="categoryView.category3Id">/</span>
      <p v-if="categoryView.category3Id">{{ categoryView.category3Name }}</p>
    </div>
    <div class="content">
      <div class="pic">
        <Zoom :skuInfo="skuInfo" />
        <ImageList :skuInfo="skuInfo" />
      </div>
      <div class="detail">
        <div class="name">{{ skuInfo.skuName }}</div>
        <div class="desc">{{ skuInfo.skuDesc }}</div>
        <ul class="select">
          <li v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <div class="attrName">{{ saleAttr.saleAttrName }}</div>
            <ul>
              <li
                v-for="value in saleAttr.spuSaleAttrValueList"
                :key="value.id"
                :class="{ current: value.isChecked == 1 }"
                @click="changeCurrent(value.id, saleAttr.spuSaleAttrValueList)"
              >
                {{ value.saleAttrValueName }}
              </li>
            </ul>
          </li>
        </ul>
        <div class="add_shopcar">
          <div class="num">
            <input type="text" v-model="num" @blur="blur()" />
            <button @click="num++">+</button>
            <button @click="sub()" :class="{ disabled: num == 1 }">-</button>
          </div>
          <button @click="addShopcar()">加入购物车</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import Zoom from "@/components/Zoom.vue";
import ImageList from "@/components/ImageList.vue";
export default {
  name: "Detail",
  components: { Zoom, ImageList, ImageList },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router=useRouter()

    const categoryView = computed(() => {
      return store.getters.categoryView;
    });
    const skuInfo = computed(() => {
      return store.getters.skuInfo;
    });
    const spuSaleAttrList = computed(() => {
      return store.getters.spuSaleAttrList;
    });
    const num = ref(1);
    onMounted(() => {
      const id = route.params.id;
      store.dispatch("getDetailList", id);
    });
    function changeCurrent(id, list) {
      list.forEach((element) => {
        element.isChecked = 0;

        if (element.id == id) {
          element.isChecked = 1;
        }
      });
    }
    function sub() {
      if (num.value <= 1) {
        num.value = 1;
      } else {
        num.value -= 1;
      }
    }
    function blur() {
      if (Object.is(num.value * 1, NaN) || num.value < 1) {
        num.value = 1;
      } else {
        num.value = parseInt(num.value);
      }
    }
    async function addShopcar() {
      try {
        await store.dispatch("addOrUpdateShopCart", {
          id: route.params.id,
          num: num.value,
        });
      } catch (error) {
        alert(error.message);
      }
      sessionStorage.setItem('skuInfo',JSON.stringify(skuInfo.value))
      router.push({path:'/addcartsuccess',query:{num:num.value}})
    }
    return {
      categoryView,
      skuInfo,
      spuSaleAttrList,
      num,
      changeCurrent,
      sub,
      blur,
      addShopcar,
    };
  },
};
</script>

<style scoped lang="less">
.catergory {
  display: flex;
  padding-bottom: 15px;
  color: #666;
  p {
    padding: 0 10px;
    font-size: 14px;
    &:first-of-type {
      padding-left: 0;
    }
  }
}
.content {
  display: flex;
  .pic {
    flex: 1;
    cursor: pointer;
  }
  .detail {
    flex: 2;
    padding-left: 85px;
    .name {
      font-weight: 700;
      font-size: 16px;
      line-height: 25px;
    }
    .desc {
      padding-top: 10px;
      color: #c81623;
      line-height: 20px;
    }
    .select {
      margin: 30px 0;
      li {
        display: flex;
        margin: 10px 0;
        line-height: 30px;
        .attrName {
          padding-right: 30px;
          font-size: 16px;
        }
        ul {
          display: flex;
          li {
            padding: 0 10px;
            margin: 0 5px;
            border: 1px solid #c9c9c9;
            font-size: 14px;
            cursor: pointer;
          }
          .current {
            border-color: green;
            color: green;
          }
        }
      }
    }
    .add_shopcar {
      display: flex;
      .num {
        position: relative;
        margin-right: 50px;
        input {
          width: 40px;
          height: 40px;
          border: 1px solid #c9c9c9;
          outline: none;
          text-align: center;
          font-size: 14px;
        }
        button {
          position: absolute;
          top: 0;
          left: 40px;
          height: 20px;
          width: 20px;
          padding: 0;
          border: 1px solid #c9c9c9;
          background-color: #efefef;
          color: #333;
          font-weight: 400;
          &:last-of-type {
            top: 20px;
          }
        }
        .disabled {
          color: #999;
        }
      }
      button {
        width: 200px;
        height: 40px;
        padding: 0;
        border: none;
        background-color: #c81623;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
