import * as React from "react";
import { Button, Table, Modal, notification } from "antd";
import { NavLink } from "react-router-dom";
import { requests } from "../../axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import type { MapNews } from "../../type/news";
import type { Columns } from "../../type/columns";

const { confirm } = Modal;

export interface INewsPublishProps {
  list: MapNews[];
  handle: string;
  getNewsList: Function;
}

export default function NewsPublish(props: INewsPublishProps) {
  const [columns, setColumns] = React.useState<Columns[]>([]);

  function handleNewsPublishState(item: MapNews, publishState: number) {
    requests.patch(`/news/${item.id}`, { publishState }).then(() => {
      props.getNewsList();
      notification.success({
        message: <h4>通知</h4>,
        description: (
          <p>
            您可以到&nbsp;
            <span style={{ color: "#1890ff" }}>已{props.handle}</span>
            &nbsp;中查看您{props.handle}的新闻
          </p>
        ),
      });
    });
  }
  function deleteNews(item: MapNews) {
    requests.delete(`/news/${item.id}`).then(() => {
      props.getNewsList();
    });
  }
  const showConfirm = (item: MapNews) => {
    confirm({
      title: (
        <span>
          确定要{props.handle}&nbsp;
          <span style={{ color: "#1890ff" }}>{item.title}</span>&nbsp; 吗?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        switch (item.publishState) {
          case 1:
            handleNewsPublishState(item, 2);
            break;
          case 2:
            handleNewsPublishState(item, 3);
            break;
          case 3:
            deleteNews(item);
            break;
        }
      },
    });
  };

  React.useEffect(() => {
    if (props.list.length) {
      const columns = [
        {
          title: "新闻标题",
          render: (item: MapNews) => (
            <NavLink
              to={`/preview/${item.id}`}
              style={{ margin: "0px", color: "#1890ff" }}
            >
              {item.title}
            </NavLink>
          ),
        },
        {
          title: "作者",
          dataIndex: "author",
          key: "author",
        },
        {
          title: "新闻分类",
          dataIndex: "categoryName",
          key: "categoryName",
        },
        {
          title: "操作",
          render: (item: MapNews) => (
            <Button type="primary" onClick={() => showConfirm(item)}>
              {props.handle}
            </Button>
          ),
        },
      ];
      setColumns(columns);
    } else {
      setColumns([]);
    }
  }, [props.list]);

  return <Table dataSource={props.list} columns={columns} />;
}
