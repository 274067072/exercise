<template>
  <div class="footer">
    <div class="container">
      <ul class="help">
        <li v-for="(item, index) in arr" :key="index">
          <dl>
            <dt>{{ item.title }}</dt>
            <dd v-for="(i, index) in item.details" :key="index">
              <a href="javascript:;">{{ i }}</a>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dt>帮助中心</dt>
            <dd>
              <a href="javascript:;"
                ><img src="@/assets/51662616543_.pic.jpg" alt="帮助中心" /><span
                  >品优购客户端</span
                >
              </a>
            </dd>
          </dl>
        </li>
      </ul>
      <div class="copyright">
        <ul>
          <li v-for="(item, index) in copyrightArr" :key="index">
            <a href="javascript:;">{{ item }}</a>
          </li>
        </ul>
        <p>
          地址：北京市昌平区建材城西路金燕龙办公楼一层 邮编:100096
          电话:400-618-4000 传真:010-82935100 邮箱: zhanghj+itcast.cn
        </p>
        <p>京ICP备08001421号京公网安备110108007702</p>
      </div>
    </div>
  </div>
</template>

<script>
import { readonly } from "@vue/reactivity";
export default {
  name: "Footer",
  setup() {
    const arr = readonly([
      {
        title: "购物指南",
        details: [
          "购物流程",
          "会员介绍",
          "生活旅行/团购",
          "常见问题",
          "大家电",
          "联系客服",
        ],
      },
      {
        title: "配送方式",
        details: [
          "上门自提",
          "211限时达",
          "配送服务查询",
          "配送费收取标准",
          "海外配送",
        ],
      },
      {
        title: "支付方式",
        details: ["货到付款", "在线支付", "分期付款", "邮局汇款", "公司转账"],
      },
      {
        title: "售后服务",
        details: [
          "售后政策",
          "价格保护",
          "退款说明",
          "返修/退换货",
          "取消订单",
        ],
      },
      {
        title: "特色服务",
        details: ["夺宝岛", "DIY装机", "延保服务", "品优购E卡", "品优购通信"],
      },
    ]);
    const copyrightArr = readonly([
      "关于我们",
      "联系我们",
      "联系客服",
      "商家入驻",
      "营销中心",
      "手机品优购",
      "友情链接",
      "销售联盟",
      "品优购社区",
      "品优购公益",
      "English Site",
      "Contact U",
    ]);
    return { arr, copyrightArr };
  },
};
</script>

<style scoped lang="less">
.footer {
  width: 100%;
  background-color: #f5f5f5;
  .container {
    padding: 20px 0;
    .help {
      display: flex;
      border-bottom: 1px solid #ededed;
      padding-bottom: 20px;
      li {
        margin-left: 50px;
        &:last-child {
          position: relative;
          a {
            position: absolute;
            left: -1em;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 90px;
          }
        }
        dt {
          width: 150px;
          height: 30px;
          font-size: 16px;
          line-height: 30px;
        }
        dd {
          width: 150px;
          height: 20px;
          line-height: 20px;
        }
      }
    }
    .copyright {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      ul {
        display: flex;
        align-items: center;
        height: 20px;
        li {
          padding: 0 10px;
          border-right: 1px solid #999;
          &:last-child {
            border: none;
          }
        }
      }
      p {
        height: 20px;
        line-height: 20px;
        color: #666;
      }
    }
  }
}
</style>
