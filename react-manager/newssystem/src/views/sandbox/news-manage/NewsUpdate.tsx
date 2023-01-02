import * as React from "react";
import MyNews from "../../../components/news/MyNews";
import { connect } from "react-redux";
import { getNewsList } from "../../../redux/actionCreators/newsListActionCreator";

export interface INewsUpdateProps {
  getNewsList: Function;
}
function NewsUpdate(props: INewsUpdateProps) {
  return <MyNews getNewsList={props.getNewsList} pageHeaderTitle="更新新闻" />;
}

const mapDispatchToProps = {
  getNewsList,
};
export default connect(null, mapDispatchToProps)(NewsUpdate);
