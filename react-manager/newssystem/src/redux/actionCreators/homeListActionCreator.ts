import type { AppDispatch } from "..";
import { requests } from "../../axios";

export const getViewList = () => {
  return (dispatch: AppDispatch) => {
    requests
      .get("/news?_expand=category&_sort=view&_order=desc&_limit=6")
      .then((res) => {
        dispatch({ type: "getViewList", res: res.data });
      });
  };
};

export const getStarList = () => {
  return (dispatch: AppDispatch) => {
    requests
      .get("/news?_expand=category&_sort=star&_order=desc&_limit=6")
      .then((res) => {
        dispatch({ type: "getStarList", res: res.data });
      });
  };
};
