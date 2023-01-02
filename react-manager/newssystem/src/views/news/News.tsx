import * as React from "react";
import { Card, Col, Row, PageHeader, List } from "antd";
import { requests } from "../../axios";

import type { ReadNews } from "../../type/readNews";
import { useNavigate } from "react-router-dom";

export interface INewsProps {}

export default function News(props: INewsProps) {
  const navigate = useNavigate();

  const [data, setData] = React.useState<ReadNews[]>([]);

  React.useEffect(() => {
    requests.get("/categories?_embed=news").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <div
        className="site-card-wrapper"
        style={{ margin: " 0 auto", width: "98%" }}
      >
        <Row gutter={[16, 16]}>
          {data.map((item) => (
            <Col span={8} key={item.id}>
              <Card title={item.title} bordered hoverable>
                <List
                  dataSource={item.news.filter(
                    (news) => news.publishState === 2
                  )}
                  renderItem={(news) => (
                    <List.Item
                      style={{ color: "#1890ff" }}
                      onClick={() => navigate(`/details/${news.id}`)}
                    >
                      {news.title}
                    </List.Item>
                  )}
                  pagination={{ defaultCurrent: 1, pageSize: 2 }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}
