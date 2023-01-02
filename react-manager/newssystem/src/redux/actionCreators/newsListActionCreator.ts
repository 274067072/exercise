import type { AppDispatch } from "..";
import { requests } from "../../axios";

export const getNewsList = () => {
  return (dispatch: AppDispatch) => {
    requests.get("/news?_expand=category").then((res) => {
      dispatch({ type: "getNewsList", res: res.data });
    });
  };
};
