import { createApp } from "vue";
import App from "./App.vue";
import "normalize.css";
import router from "@/router";
import store from "@/vuex";
import Dropdown from "@/components/Dropdown.vue";
import Pagenation from "@/components/Pagenation.vue";
import "@/mock/mockServer";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

const app = createApp(App);
app.component("Dropdown", Dropdown);
app.component("Pagenation", Pagenation);
app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount("#app");
