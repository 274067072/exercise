import type { Actions } from "../../type/action";
import type { Rights } from "../../type/sideMenu";

export default (initailState: Rights[] = [], action: Actions) => {
  switch (action.type) {
    case "getSideMenuList":
      const state: Rights[] = action.res;
      return state;

    default:
      return initailState;
  }
};
