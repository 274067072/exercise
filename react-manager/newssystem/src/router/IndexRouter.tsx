import * as React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../views/login/Login";
import Auth from "../views/auth/Auth";
import Home from "../views/sandbox/home/Home";
import UserList from "../views/sandbox/user-manage/UserList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import RightList from "../views/sandbox/right-manage/RightList";
import NoPermission from "../views/sandbox/nopermission/NoPermission";
import NewsAdd from "../views/sandbox/news-manage/NewsAdd";
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import Published from "../views/sandbox/publish-manage/Published";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import SunSet from "../views/sandbox/publish-manage/Sunset";
import { connect } from "react-redux";
import NewsPreviews from "../views/sandbox/news-manage/NewsPreviews";
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate";
import { Spin } from "antd";
import "./spin.scss";
import News from "../views/news/News";
import Details from "../views/news/Details";

import type { Rights } from "../type/sideMenu";
import type { RootState } from "../redux";
import type { MyRoute } from "../type/router";

export interface IIndexRouterProps {
  list: Rights[];
  isLoading: boolean;
}
const LocalRouterMap: Record<string, JSX.Element> = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <SunSet />,
};

function IndexRouter(props: IIndexRouterProps) {
  const [list, setList] = React.useState<MyRoute[]>([]);

  function mapList(list: Rights[]): MyRoute[] {
    return list.map((item) => {
      const newList = {
        key: item.key,
        pagepermission: item.pagepermisson,
      };
      if (item.children?.length) {
        const children = mapList(item.children);
        return { ...newList, children };
      }
      return newList;
    });
  }
  function filterList(list: MyRoute[]): MyRoute[] {
    const {
      role: { rights },
    } = JSON.parse(localStorage.getItem("token") as string);
    return list.filter((item) => {
      if (item.children?.length) {
        const children = filterList(item.children);
        if (children.length) {
          item.children = children;
        } else {
          delete item.children;
        }
      }
      return item.pagepermission === 1 && rights.includes(item.key);
    });
  }
  function mapRouteList(list: MyRoute[]): MyRoute[] {
    let routeList: MyRoute[] = [];
    list.forEach((item) => {
      if (item.children) {
        item.children.forEach((item) => {
          routeList.push(item);
        });
      } else {
        routeList.push(item);
      }
    });
    return routeList;
  }

  React.useEffect(() => {
    if (props.list.length) {
      setList(mapRouteList(filterList(mapList(props.list))));
    }
  }, [props.list]);

  return (
    <BrowserRouter>
      <Spin size="large" spinning={props.isLoading}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Auth />}>
            <Route path="/" element={<Navigate to="/home" />} />
            {list.map((item) => {
              return (
                <Route
                  key={item.key}
                  path={item.key.substring(1)}
                  element={LocalRouterMap[item.key]}
                />
              );
            })}
            <Route path="/preview/:id" element={<NewsPreviews />}></Route>
            <Route path="/update/:id" element={<NewsUpdate />}></Route>
            <Route path="*" element={<NoPermission />} />
          </Route>
          <Route path="/news" element={<News />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </Spin>
    </BrowserRouter>
  );
}

function mapStateToProps(state: RootState) {
  return {
    list: state.sideMenuListReducer,
    isLoading: state.isLoadingReducer,
  };
}

export default connect(mapStateToProps)(IndexRouter);
