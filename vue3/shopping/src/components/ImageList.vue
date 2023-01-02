<template>
  <swiper :modules="modules" :slides-per-view="4" :space-between="0" navigation>
    <swiper-slide v-for="(img, i) in imgList" :key="img.id"
      ><img :src="img.imgUrl" @click="pick(i)" :class="{ current: index == i }"
    /></swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { computed, ref } from "@vue/runtime-core";
import emitter from "@/utils/bus";
export default {
  name: "ImageList",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: ["skuInfo"],
  setup(props) {
    const imgList = computed(() => {
      return props.skuInfo.skuImageList || [];
    });
    const index = ref(0);
    function pick(i) {
      index.value = i;
      emitter.emit("changeImg", i);
    }
    return {
      modules: [Navigation],
      imgList,
      index,
      pick,
    };
  },
};
</script>

<style scoped lang="less">
.swiper {
  width: 360px;
  height: 90px;
  margin: 0;
  img {
    width: 90px;
    height: 90px;
    border: 1px solid #c9c9c9;
  }
  .current {
    border-color: orange;
  }
}
</style>
