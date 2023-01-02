import { connect } from "react-redux";
import * as React from "react";
import { getNewsList } from "../../../redux/actionCreators/newsListActionCreator";
import NewsPublish from "../../../components/news/NewsPublish";

import type { News, MapNews } from "../../../type/news";
import type { RootState } from "../../../redux";

export interface ISunSetProps {
  list: News[];
  getNewsList: Function;
}

function SunSet(props: ISunSetProps) {
  const [sunsetList, setSunsetList] = React.useState<MapNews[]>([]);

  function mapNewsList(list: News[]): MapNews[] {
    return list.map((item) => {
      return { ...item, categoryName: item.category.title, key: item.id };
    });
  }
  function filterUnpublishedList(list: MapNews[]): MapNews[] {
    return list.filter((item) => {
      return item.publishState === 3;
    });
  }

  React.useEffect(() => {
    if (props.list.length) {
      setSunsetList(filterUnpublishedList(mapNewsList(props.list)));
    } else {
      setSunsetList([]);
    }
  }, [props.list]);

  return (
    <NewsPublish
      list={sunsetList}
      getNewsList={props.getNewsList}
      handle="删除"
    />
  );
}

function mapStateToProps(state: RootState) {
  return { list: state.newsListReducer };
}
const mapDispatchToProps = {
  getNewsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(SunSet);
