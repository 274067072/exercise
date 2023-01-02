<template>
  <div class="container">
    <p>订单编号：{{ orderId }}</p>
    <p>共需支付：￥{{ totalFee }}</p>
    <button v-if="codeUrl" @click="open()">支付</button>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessageBox } from "element-plus";
import QRCode from "qrcode";
import { reqPayState } from "@/axios";
export default {
  name: "Pay",
  setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const orderId = ref(route.query.orderId);
    const totalFee = computed(() => store.state.pay.payInfo.totalFee);
    const codeUrl = computed(() => store.state.pay.payInfo.codeUrl);
    let code = "";
    let qrcode = "";
    let timer = null;
    onMounted(() => {
      store.dispatch("getPayInfo", orderId.value);
    });
    function beforeClose(action, instance, done) {
      if (action == "confirm") {
        if (!code) {
          alert("还未完成支付");
        } else {
          done();
        }
      } else {
        done();
      }
    }
    async function generateQR(codeUrl) {
      try {
        qrcode = await QRCode.toDataURL(codeUrl);
      } catch (err) {
        console.error(err);
      }
    }
    async function open() {
      if (!timer) {
        timer = setInterval(async () => {
          let res = await reqPayState(orderId.value);
          if (res["code"] == 200) {
            code = res["code"];
            clearInterval(timer);
            timer = null;
            router.push("/paysuccess");
          }
        }, 1000);
      }
      await generateQR(codeUrl.value);
      ElMessageBox.alert(`<img src=${qrcode}>`, "微信扫码支付", {
        dangerouslyUseHTMLString: true,
        showCancelButton: true,
        distinguishCancelAndClose: true,
        center: true,
        confirmButtonText: "已完成支付",
        cancelButtonText: "支付遇到问题",
        beforeClose,
      }).then(
        () => {
          clearInterval(timer);
          timer = null;
          router.push("/paysuccess");
        },
        (action) => {
          clearInterval(timer);
          timer = null;
          if (action == "cancel") alert("请联系管理员");
        }
      );
    }
    return {
      orderId,
      totalFee,
      codeUrl,
      open,
    };
  },
};
</script>

<style scoped lang="less">
p {
  line-height: 20px;
}
button {
  width: 100px;
  height: 40px;
  background-color: #c81623;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
</style>
