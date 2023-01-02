import type { Actions } from "../../type/action";
import type { Role } from "../../type/roleList";

export default (initialState: Role[] = [], action: Actions) => {
  switch (action.type) {
    case "getRoleList":
      const state: Role[] = action.res;
      return state;

    default:
      return initialState;
  }
};
