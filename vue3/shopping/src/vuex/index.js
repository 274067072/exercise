import { createStore } from "vuex";
import dropdown from "./dropdown";
import home from "./home";
import search from "./search";
import detail from "./detail";
import shopcar from "./shopcar";
import user from "./user";
import trade from "./trade";
import pay from "./pay";
import center from "./center";

export default createStore({
  modules: {
    dropdown,
    home,
    search,
    detail,
    shopcar,
    user,
    trade,
    pay,
    center,
  },
});
