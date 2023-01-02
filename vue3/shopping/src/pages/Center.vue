<template>
  <div class="container">
    <div class="left">
      <h3>个人中心</h3>
      <ul>
        <li><router-link to="/center/myorder">我的订单</router-link></li>
        <li>团购订单</li>
        <li>本地生活订单</li>
      </ul>
    </div>
    <div class="right">
      <router-view></router-view>
      <div class="blank"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Center",
};
</script>

<style scoped lang="less">
.container {
  display: flex;
  .left {
    width: 300px;
    margin: 20px 0;
    ul {
      margin-top: 15px;
      li {
        text-align: center;
        line-height: 40px;
        border-bottom: 1px solid #c9c9c9;
        cursor: pointer;
        &:hover {
          background-color: #efefef;
        }
        a {
          display: block;
          color: #000;
          &:hover {
            color: #000;
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    position: relative;
    padding: 20px;
    .blank {
      height: 40px;
    }
  }
}
</style>
