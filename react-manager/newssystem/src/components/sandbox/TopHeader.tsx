import * as React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import style from "./sandbox.module.scss";
import DropDown from "./DropDown";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";

import type { RootState } from "../../redux";
import type { Rights } from "../../type/sideMenu";

const { Header } = Layout;

export interface ITopHeaderProps {
  collapsed: boolean;
  setCollapsed: Function;
  list: Rights[];
}

function TopHeader(props: ITopHeaderProps) {
  const location = useLocation();
  const { username } = JSON.parse(localStorage.getItem("token") as string);

  const [title, setTitle] = React.useState<string>("");

  function filterTitle(): string {
    const index = location.pathname.indexOf("/", 1);
    if (index === -1) {
      return (
        props.list.filter((item) => {
          return item.key === location.pathname;
        })[0]?.title || "403"
      );
    } else {
      let title: string;
      if (location.pathname.match(/preview/)) {
        title = "新闻预览";
        return title;
      } else if (location.pathname.match(/update/)) {
        title = "编辑新闻";
        return title;
      }
      const rootPathName = location.pathname.substring(0, index);
      const list = props.list.filter((item) => {
        return item.key === rootPathName;
      });
      return (
        (list[0].children as Rights[]).filter((item) => {
          return item.key === location.pathname;
        })[0]?.title || "403"
      );
    }
  }

  React.useEffect(() => {
    if (props.list.length) {
      setTitle(filterTitle());
    }
  }, [props.list, location.pathname]);

  return (
    <Header
      className={style["site-layout-background"]}
      style={{ padding: 0, position: "relative" }}
    >
      {React.createElement(
        props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
        {
          className: style.trigger,
          onClick: () => props.setCollapsed(!props.collapsed),
        }
      )}
      <p style={{ position: "absolute", top: "0px", left: "60px" }}>{title}</p>
      <DropDown />
      <p style={{ float: "right", padding: "0 15px" }}>
        欢迎
        <a
          onClick={(e) => {
            e.preventDefault();
          }}
          style={{ padding: "0 5px" }}
        >
          {username}
        </a>
        回来
      </p>
    </Header>
  );
}

function mapStateToProps(state: RootState) {
  return {
    list: state.sideMenuListReducer,
  };
}

export default connect(mapStateToProps)(TopHeader);
