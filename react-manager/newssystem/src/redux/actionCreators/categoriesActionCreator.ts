import type { AppDispatch } from "..";
import { requests } from "../../axios";

export const getCategoriesList = () => {
  return (dispatch: AppDispatch) => {
    requests.get("/categories").then((res) => {
      dispatch({ type: "getCategoriesList", res: res.data });
    });
  };
};
