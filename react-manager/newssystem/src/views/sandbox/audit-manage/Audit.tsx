import * as React from "react";
import { connect } from "react-redux";
import { getNewsList } from "../../../redux/actionCreators/newsListActionCreator";
import { Table, Button, Modal, Tooltip } from "antd";
import {
  ExclamationCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { requests } from "../../../axios";
import { NavLink } from "react-router-dom";

import type { RootState } from "../../../redux";
import type { MapNews, News } from "../../../type/news";
import type { Columns } from "../../../type/columns";

const { confirm } = Modal;

export interface IAuditProps {
  list: News[];
  getNewsList: Function;
}

function Audit(props: IAuditProps) {
  const [auditList, setAuditList] = React.useState<MapNews[]>([]);
  const [columns, setColumns] = React.useState<Columns[]>([]);

  function filterAuditList(list: News[]): News[] {
    return list.filter((item) => {
      return item.auditState === 1;
    });
  }
  function mapAuditList(list: News[]): MapNews[] {
    return list.map((item) => {
      return { ...item, key: item.id, categoryName: item.category.title };
    });
  }
  function handleAuditStateAndPublishState(
    item: MapNews,
    auditState: number,
    publishState: number
  ) {
    requests
      .patch(`/news/${item.id}`, { auditState, publishState })
      .then(() => {
        props.getNewsList();
      });
  }
  const showConfirm = (item: MapNews, isPass: boolean) => {
    confirm({
      title: (
        <span>
          确定要{isPass ? "通过" : "驳回"}&nbsp;
          <span style={{ color: "#1890ff" }}>{item.title}</span>
          &nbsp;吗?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        isPass
          ? handleAuditStateAndPublishState(item, 2, 1)
          : handleAuditStateAndPublishState(item, 3, 0);
      },
    });
  };

  React.useEffect(() => {
    if (props.list.length) {
      setAuditList(mapAuditList(filterAuditList(props.list)));
    } else {
      setAuditList([]);
    }
  }, [props.list]);
  React.useEffect(() => {
    if (auditList.length) {
      const columns = [
        {
          title: "新闻标题",
          render: (item: MapNews) => {
            return (
              <NavLink
                to={`/preview/${item.id}`}
                style={{ margin: "0px", color: "#1890ff" }}
              >
                {item.title}
              </NavLink>
            );
          },
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
          render: (item: MapNews) => {
            return (
              <>
                <Tooltip title="通过">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CheckOutlined />}
                    style={{ marginRight: "10px" }}
                    onClick={() => showConfirm(item, true)}
                  />
                </Tooltip>
                <Tooltip title="驳回">
                  <Button
                    danger
                    type="primary"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => showConfirm(item, false)}
                  />
                </Tooltip>
              </>
            );
          },
        },
      ];
      setColumns(columns);
    } else {
      setColumns([]);
    }
  }, [auditList]);

  return <Table dataSource={auditList} columns={columns} />;
}

function mapStateToProps(state: RootState) {
  return { list: state.newsListReducer };
}
const mapDispatchToProps = {
  getNewsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Audit);
