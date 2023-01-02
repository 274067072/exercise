import * as React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import { Layout } from "antd";

const { Content } = Layout;

export interface INewsSandBoxProps {}

export default function NewsSandBox(props: INewsSandBoxProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <Layout style={{ height: "100%" }}>
      <SideMenu collapsed={collapsed} />
      <Layout style={{ height: "100%", display: "flex" }}>
        <TopHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            flex: "1",
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
