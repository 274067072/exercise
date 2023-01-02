import * as React from "react";
import NewsPreviews from "../sandbox/news-manage/NewsPreviews";

export interface IDetailsProps {}

export default function Details(props: IDetailsProps) {
  return <NewsPreviews detail={true} />;
}
