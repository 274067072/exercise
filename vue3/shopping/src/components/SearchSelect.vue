<template>
  <div class="header">
    <ul>
      <li>
        <div>品牌</div>
        <ul>
          <li v-for="trademark in trademarkList" :key="trademark.tmId">
            <a
              href="javascript:;"
              @click="getTrademark(trademark.tmId, trademark.tmName)"
              >{{ trademark.tmName }}</a
            >
          </li>
        </ul>
      </li>
      <li v-for="attr in attrsList" :key="attr.attrId">
        <div>{{ attr.attrName }}</div>
        <ul>
          <li v-for="(attrValue, index) in attr.attrValueList" :key="index">
            <a
              href="javascript:;"
              @click="getProps(attr.attrId, attrValue, attr.attrName)"
              >{{ attrValue }}</a
            >
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SearchSelect",
  props: ["trademarkList", "attrsList"],
  emits: ["addTrademark", "addProps"],
  setup(props, { emit }) {
    function getTrademark(id, value) {
      emit("addTrademark", id, value);
    }
    function getProps(id, value, title) {
      emit("addProps", id, value, title);
    }
    return { getTrademark, getProps };
  },
};
</script>

<style scoped lang="less">
.header {
  ul {
    margin: 20px 0;
    border: 1px solid #c9c9c9;
    font-size: 14px;
    line-height: 30px;
    li {
      display: flex;
      border-bottom: 1px solid #c9c9c9;
      &:last-of-type {
        border: none;
      }
      div {
        flex: 1;
        padding-right: 10px;
        background-color: #efefef;
        border-right: 1px solid #c9c9c9;
        text-align: right;
      }
      ul {
        flex: 9;
        display: flex;
        margin: 0;
        border: none;
        li {
          border: none;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
