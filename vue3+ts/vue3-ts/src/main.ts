import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import axios from "axios";
import VueAxios from "vue-axios";

const app = createApp(App);
app.use(router);
app.use(ArcoVue);
app.use(VueAxios, axios);
app.mount("#app");
