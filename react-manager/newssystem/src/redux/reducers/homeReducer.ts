import type { Actions } from "../../type/action";
import type { Sort } from "../../type/home";
const Immutable = require("immutable");

const { fromJS } = Immutable;

export default (
  initialState: Sort = { viewList: [], starList: [] },
  action: Actions
) => {
  let state = fromJS(initialState);
  let newState = null;
  switch (action.type) {
    case "getViewList":
      newState = state.set("viewList", action.res);
      return newState.toJS();
    case "getStarList":
      newState = state.set("starList", action.res);
      return newState.toJS();
    default:
      return initialState;
  }
};
