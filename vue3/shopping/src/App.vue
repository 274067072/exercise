<template>
  <Header />
  <router-view></router-view>
  <Footer v-show="route.meta.isShowFooter" />
</template>

<script>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { useStore } from "vuex";

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    onMounted(() => {
      store.dispatch("getCategoryList");
    });
    return { route };
  },
};
</script>

<style></style>
