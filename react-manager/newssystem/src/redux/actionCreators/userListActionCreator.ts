import type { AppDispatch } from "..";
import { requests } from "../../axios";

export const getUserList = () => {
  return (dispatch: AppDispatch) =>
    requests.get("/users?_expand=role").then((res) => {
      dispatch({ type: "getUserList", res: res.data });
    });
};
