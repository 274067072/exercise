import type { AppDispatch } from "..";
import { requests } from "../../axios";

export const getRegions = () => {
  return (dispatch: AppDispatch) =>
    requests.get("/regions").then((res) => {
      dispatch({ type: "getRegions", res: res.data });
    });
};
