import type { Actions } from "../../type/action";
import type { Region } from "../../type/regionList";
import type { User } from "../../type/userList";
const Immutable = require("immutable");

const { fromJS } = Immutable;

export default (
  initialState: { userList: User[]; regionList: Region[] } = {
    userList: [],
    regionList: [],
  },
  action: Actions
) => {
  const oldState = fromJS(initialState);
  let newState = null;
  switch (action.type) {
    case "getUserList":
      newState = oldState.set("userList", action.res);
      newState = newState.toJS();
      return newState;
    case "getRegions":
      newState = oldState.set("regionList", action.res);
      return newState.toJS();
    default:
      return oldState.toJS();
  }
};
