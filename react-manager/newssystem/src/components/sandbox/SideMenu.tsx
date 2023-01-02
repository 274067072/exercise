import * as React from "react";
import {
  GlobalOutlined,
  HomeOutlined,
  UserOutlined,
  CrownOutlined,
  ReadOutlined,
  AuditOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import style from "./sandbox.module.scss";
import { getSideMenuList } from "../../redux/actionCreators/sideMenuListActionCreator";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { requests } from "../../axios";
import { getCategoriesList } from "../../redux/actionCreators/categoriesActionCreator";
import { getRoleList } from "../../redux/actionCreators/roleListActionCreator";
import { getNewsList } from "../../redux/actionCreators/newsListActionCreator";

import type { MenuProps } from "antd";
import type { RootState } from "../../redux";
import type { MapSideMenu, Rights } from "../../type/sideMenu";

const { Sider } = Layout;
export interface ISideMenuProps {
  collapsed: boolean;
  list: Rights[];
  getSideMenuList: Function;
  getCategoriesList: Function;
  getRoleList: Function;
  getNewsList: Function;
}

function SideMenu(props: ISideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = React.useState<MenuProps["items"]>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<string>("");
  const [openKeys, setOpenKeys] = React.useState<string>("");

  const Icons: Record<string, JSX.Element> = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <CrownOutlined />,
    "/news-manage": <ReadOutlined />,
    "/audit-manage": <AuditOutlined />,
    "/publish-manage": <CloudUploadOutlined />,
  };

  function onClick(e: any) {
    navigate(e.key);
  }
  function onOpenChange(e: string[]) {
    setOpenKeys(e[1]);
  }
  function getSelectedKeys() {
    const selectedKeys =
      location.pathname === "/" ? "/home" : location.pathname;
    setSelectedKeys(selectedKeys);
  }
  function getOpenKeys() {
    const index = selectedKeys.indexOf("/", 1);
    const openKeys = selectedKeys.substring(0, index);

    setOpenKeys(openKeys);
  }
  function MapSideMenu(list: Rights[]): MapSideMenu[] {
    return list.map((item) => {
      const newList: MapSideMenu = {
        id: item.id,
        key: item.key,
        label: item.title,
        grade: item.grade,
        pagepermisson: item.pagepermisson,
      };
      if (item.children?.length) {
        const children = MapSideMenu(item.children);
        return {
          ...newList,
          children,
        };
      }
      return newList;
    });
  }
  function filterSideMenu(list: MapSideMenu[]): MapSideMenu[] {
    return list.filter((item) => {
      if (item.children?.length) {
        const children = filterSideMenu(item.children);
        if (children.length) {
          item.children = children;
        } else {
          delete item.children;
        }
      }
      return item.pagepermisson === 1;
    });
  }
  function addIcon(list: MapSideMenu[]): MapSideMenu[] {
    return list.map((item) => {
      return { ...item, icon: Icons[item.key] };
    });
  }
  function checkPagePermission(list: MapSideMenu[]): MapSideMenu[] {
    const {
      role: { rights },
    } = JSON.parse(localStorage.getItem("token") as string);
    return list.filter((item) => {
      if (item.children?.length) {
        item.children = checkPagePermission(item.children);
      }
      return rights.includes(item.key);
    });
  }

  React.useEffect(() => {
    props.getSideMenuList();
    props.getCategoriesList();
    props.getRoleList();
    props.getNewsList();
  }, []);
  React.useEffect(() => {
    const { username, password } = JSON.parse(
      localStorage.getItem("token") as string
    );
    requests
      .get(
        `/users?username=${username}&password=${password}&roleState=true&_expand=role`
      )
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.data[0]));
        const list = checkPagePermission(
          addIcon(filterSideMenu(MapSideMenu(props.list)))
        );
        setItems(list);
      });
  }, [props.list]);
  React.useEffect(() => {
    getSelectedKeys();
  }, [location.pathname]);
  React.useEffect(() => {
    getOpenKeys();
  }, [selectedKeys]);

  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div className={style.logo}>
          {props.collapsed ? <GlobalOutlined /> : "全球新闻发布管理系统"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          selectedKeys={[selectedKeys]}
          openKeys={[openKeys]}
          onClick={(e) => onClick(e)}
          onOpenChange={(e) => onOpenChange(e)}
          style={{ flex: "1", overflow: "auto" }}
        />
      </div>
    </Sider>
  );
}

function mapStateToProps(state: RootState) {
  return {
    list: state.sideMenuListReducer,
  };
}
const mapDispatchToProps = {
  getSideMenuList,
  getCategoriesList,
  getRoleList,
  getNewsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
