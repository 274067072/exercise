import type { Actions } from "../../type/action";
import type { News } from "../../type/news";

export default (initialState: News[] = [], action: Actions) => {
  switch (action.type) {
    case "getNewsList":
      const state: News[] = action.res;
      return state;

    default:
      return initialState;
  }
};
