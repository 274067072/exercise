import * as React from "react";
import * as echarts from "echarts";
import { Col, Row, Avatar, Card, Drawer } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import {
  getViewList,
  getStarList,
} from "../../../redux/actionCreators/homeListActionCreator";
import { NavLink } from "react-router-dom";
import "./home.scss";

import type { RootState } from "../../../redux";
import type { News } from "../../../type/news";
import type { Categories } from "../../../type/categories";
import { PieData } from "../../../type/home";

const { Meta } = Card;

export interface IHomeProps {
  viewList: News[];
  starList: News[];
  newsList: News[];
  categoryList: Categories[];
  getViewList: Function;
  getStarList: Function;
}

function Home(props: IHomeProps) {
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token") as string);

  const [data, setData] = React.useState<number[]>([]);
  const [xAxis, setXAxis] = React.useState<string[]>([]);
  const HistogramRef = React.useRef<any>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const PieRef = React.useRef<any>(null);
  const [pieData, setPieData] = React.useState<PieData[]>([]);

  function filterNewsList(list: News[]): News[] {
    return list.filter((item) => {
      return item.publishState === 2;
    });
  }
  function calNewsNumber(list: News[]): number[] {
    let arr: number[] = [...new Array(props.categoryList.length)].map(() => 0);
    list.forEach((item) => {
      arr[item.categoryId - 1] += 1;
    });
    return arr;
  }
  function calXAxis(list: Categories[]): string[] {
    let arr: string[] = [];
    list.forEach((item) => {
      arr.push(item.title);
    });
    return arr;
  }
  function filterUserNewsList(list: News[]): News[] {
    return list.filter((item) => {
      return item.author === username && item.publishState === 2;
    });
  }
  function calPieData() {
    let pieData: PieData[] = [];
    const data = calNewsNumber(filterUserNewsList(props.newsList));
    data.forEach((value, index) => {
      pieData[index] = {
        value,
        name: xAxis[index],
      };
    });
    setPieData(pieData);
  }

  React.useEffect((): any => {
    props.getStarList();
    props.getViewList();
    return () => (window.onresize = null);
  }, []);
  React.useEffect(() => {
    if (props.newsList.length && props.categoryList.length) {
      setData(calNewsNumber(filterNewsList(props.newsList)));
      setXAxis(calXAxis(props.categoryList));
    } else {
      setData([]);
      setXAxis([]);
    }
  }, [props.newsList, props.categoryList]);
  React.useEffect(() => {
    if (data.length && xAxis.length && HistogramRef.current) {
      const myChart = echarts.init(HistogramRef.current);
      myChart.setOption({
        title: {
          text: "新闻分类图示",
        },
        legend: {
          width: 350,
          left: "45%",
          type: "plain",
        },
        tooltip: {},
        xAxis: {
          data: xAxis,
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          minInterval: 1,
        },
        series: [
          {
            name: "发布数量",
            type: "bar",
            data: data,
          },
        ],
      });
      window.onresize = () => {
        myChart.resize();
      };
    }
  }, [data, xAxis, HistogramRef.current]);
  React.useEffect(() => {
    xAxis.length && calPieData();
  }, [xAxis]);

  React.useEffect(() => {
    if (pieData.length && PieRef.current && open) {
      const myChart = echarts.init(PieRef.current);
      myChart.setOption({
        title: {
          text: "当前用户新闻分类图示",
          left: "center",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "发布数量",
            type: "pie",
            radius: "50%",
            data: pieData,
          },
        ],
      });
    }
  }, [pieData, PieRef.current, open]);

  return (
    <>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered>
              {props.viewList.length &&
                props.viewList.map((item, index) => (
                  <NavLink
                    key={item.id}
                    to={`/preview/${item.id}`}
                    style={{
                      display: "block",
                      lineHeight: "45px",
                      color: "#1890ff",
                      borderBottom: index === 5 ? "none" : "1px solid #f0f0f0",
                    }}
                  >
                    {item.title}
                  </NavLink>
                ))}
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered>
              {props.starList.length &&
                props.starList.map((item, index) => (
                  <NavLink
                    key={item.id}
                    to={`/preview/${item.id}`}
                    style={{
                      display: "block",
                      lineHeight: "45px",
                      color: "#1890ff",
                      borderBottom: index === 5 ? "none" : "1px solid #f0f0f0",
                    }}
                  >
                    {item.title}
                  </NavLink>
                ))}
            </Card>
          </Col>
          <Col span={8}>
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                width: 300,
                height: "100%",
              }}
              cover={
                <img
                  height="100%"
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" onClick={() => setOpen(true)} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={username}
                description={
                  <span>
                    <span style={{ marginRight: 15, fontWeight: "700" }}>
                      {region}
                    </span>
                    {roleName}
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div
        ref={HistogramRef}
        style={{ marginTop: 20, width: "100%", height: "259px" }}
      ></div>
      <Drawer
        title="个人新闻分类"
        placement="right"
        width="500px"
        onClose={() => setOpen(false)}
        open={open}
      >
        <div ref={PieRef} style={{ width: "500px", height: "100%" }}></div>
      </Drawer>
    </>
  );
}

function mapStateToProps(state: RootState) {
  return {
    viewList: state.homeReducer.viewList,
    starList: state.homeReducer.starList,
    newsList: state.newsListReducer,
    categoryList: state.newsCategoriesReducer,
  };
}
const mapDispatchToProps = {
  getViewList,
  getStarList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
