import type { AppDispatch } from "..";
import { requests } from "../../axios";

export const getSideMenuList = () => {
  return (dispatch: AppDispatch) => {
    requests.get("/rights?_embed=children").then((res) => {
      dispatch({ type: "getSideMenuList", res: res.data });
    });
  };
};
