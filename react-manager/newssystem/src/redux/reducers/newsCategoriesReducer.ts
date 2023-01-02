import type { Actions } from "../../type/action";
import type { Categories } from "../../type/categories";

export default (initialState: Categories[] = [], action: Actions) => {
  switch (action.type) {
    case "getCategoriesList":
      const state: Categories[] = action.res;
      return state;
    default:
      return initialState;
  }
};
