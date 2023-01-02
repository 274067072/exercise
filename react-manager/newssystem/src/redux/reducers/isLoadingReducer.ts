import { Actions } from "../../type/action";

export default (initialState: boolean = false, action: Actions) => {
  switch (action.type) {
    case "changeIsLoading":
      const state: boolean = action.res;
      return state;

    default:
      return initialState;
  }
};
