import { connect } from "react-redux";
import * as React from "react";
import { getNewsList } from "../../../redux/actionCreators/newsListActionCreator";
import NewsPublish from "../../../components/news/NewsPublish";

import type { News, MapNews } from "../../../type/news";
import type { RootState } from "../../../redux";

export interface IPublishedProps {
  list: News[];
  getNewsList: Function;
}

function Published(props: IPublishedProps) {
  const [publishedList, setPublishedList] = React.useState<MapNews[]>([]);

  function mapNewsList(list: News[]): MapNews[] {
    return list.map((item) => {
      return { ...item, categoryName: item.category.title, key: item.id };
    });
  }
  function filterPublishedList(list: MapNews[]): MapNews[] {
    return list.filter((item) => {
      return item.publishState === 2;
    });
  }

  React.useEffect(() => {
    if (props.list.length) {
      setPublishedList(filterPublishedList(mapNewsList(props.list)));
    } else {
      setPublishedList([]);
    }
  }, [props.list]);

  return <NewsPublish list={publishedList} getNewsList={props.getNewsList} handle="下线"/>;
}

function mapStateToProps(state: RootState) {
  return { list: state.newsListReducer };
}
const mapDispatchToProps = {
  getNewsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Published);
