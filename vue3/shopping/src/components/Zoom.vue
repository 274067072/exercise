<template>
  <div
    class="pic_container"
    @mouseenter="isShow = true"
    @mouseleave="isShow = false"
    v-if="imgList"
  >
    <img :src="imgList[index].imgUrl" @mousemove="handler($event)" />
    <div class="shade" v-show="isShow" ref="shade"></div>
    <div class="big_pic" v-show="isShow">
      <img :src="imgList[index].imgUrl" ref="bigImg" />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/runtime-core";
import emitter from "@/utils/bus";
export default {
  name: "Zoom",
  props: ["skuInfo"],
  setup(props) {
    const imgList = computed(() => {
      return props.skuInfo.skuImageList;
    });
    const isShow = ref(false);
    const shade = ref(null);
    const bigImg = ref(null);
    const index = ref(0);
    function handler(e) {
      let x = e.offsetX - 90;
      let y = e.offsetY - 90;
      if (x <= 0) x = 0;
      if (x >= 180) x = 180;
      if (y <= 0) y = 0;
      if (y >= 180) y = 180;
      shade.value.style.left = x + "px";
      shade.value.style.top = y + "px";
      bigImg.value.style.left = -2 * x + "px";
      bigImg.value.style.top = -2 * y + "px";
    }
    emitter.on("changeImg", (i) => {
      index.value = i;
    });
    return { imgList, isShow, shade, bigImg, index, handler };
  },
};
</script>

<style scoped lang="less">
.pic_container {
  position: relative;
  width: 360px;
  height: 360px;
  border: 1px solid #c9c9c9;
  img {
    width: 100%;
    cursor: move;
  }
  .shade {
    position: absolute;
    top: 0;
    left: 0;
    width: 180px;
    height: 180px;
    background-color: orange;
    opacity: 0.5;
    pointer-events: none;
  }
  .big_pic {
    position: absolute;
    top: -1px;
    left: 358px;
    width: 360px;
    height: 360px;
    border: 1px solid #c9c9c9;
    overflow: hidden;
    z-index: 999;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
    }
  }
}
</style>
