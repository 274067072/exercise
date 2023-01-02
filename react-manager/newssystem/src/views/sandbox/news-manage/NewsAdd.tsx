import * as React from "react";
import MyNews from "../../../components/news/MyNews";
import { connect } from "react-redux";
import { getNewsList } from "../../../redux/actionCreators/newsListActionCreator";

export interface INewsAddProps {
  getNewsList: Function;
}

function NewsAdd(props: INewsAddProps) {
  return <MyNews getNewsList={props.getNewsList} pageHeaderTitle="撰写新闻" />;
}

const mapDispatchToProps = {
  getNewsList,
};

export default connect(null, mapDispatchToProps)(NewsAdd);
