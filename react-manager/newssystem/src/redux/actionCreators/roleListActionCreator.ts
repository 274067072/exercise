import { requests } from "../../axios";
import type { AppDispatch } from "..";

export const getRoleList = () => {
  return (dispatch: AppDispatch) => {
    requests.get("/roles").then((res) => {
      dispatch({ type: "getRoleList", res: res.data });
    });
  };
};
