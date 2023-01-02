<template>
  <div class="container">
    <Dropdown />
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :loop="true"
      :loopPreventsSlide:="true"
      navigation
      :pagination="{ clickable: true }"
      :autoplay="{
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="focus in bannerList" :key="focus.id">
        <img :src="focus.imgUrl" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default {
  name: "Home",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("getBannerList");
    });
    const bannerList = computed(() => store.state.home.bannerList);
    const onSwiper=(swiper)=>{
      swiper.slideTo(1, 0,false);
    }
    return {
      bannerList,
      modules: [Navigation, Pagination, Autoplay],
      onSwiper
    };
  },
};
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: 600px;
  .swiper {
    position: absolute;
    top: 10px;
    left: 218px;
    width: 721px;
    height: 490px;
    img {
      width: 721px;
      height: 490px;
    }
  }
}
</style>
