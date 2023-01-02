import { connect } from "react-redux";
import * as React from "react";
import { getNewsList } from "../../../redux/actionCreators/newsListActionCreator";
import NewsPublish from "../../../components/news/NewsPublish";

import type { News, MapNews } from "../../../type/news";
import type { RootState } from "../../../redux";

export interface IUnpublishedProps {
  list: News[];
  getNewsList: Function;
}

function Unpublished(props: IUnpublishedProps) {
  const [unpublishedList, setUnpublishedList] = React.useState<MapNews[]>([]);

  function mapNewsList(list: News[]): MapNews[] {
    return list.map((item) => {
      return { ...item, categoryName: item.category.title, key: item.id };
    });
  }
  function filterUnpublishedList(list: MapNews[]): MapNews[] {
    return list.filter((item) => {
      return item.publishState === 1;
    });
  }

  React.useEffect(() => {
    if (props.list.length) {
      setUnpublishedList(filterUnpublishedList(mapNewsList(props.list)));
    } else {
      setUnpublishedList([]);
    }
  }, [props.list]);

  return (
    <NewsPublish
      list={unpublishedList}
      getNewsList={props.getNewsList}
      handle="发布"
    />
  );
}

function mapStateToProps(state: RootState) {
  return { list: state.newsListReducer };
}
const mapDispatchToProps = {
  getNewsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Unpublished);
