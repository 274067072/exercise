import * as React from "react";
import { connect } from "react-redux";
import { getNewsList } from "../../../redux/actionCreators/newsListActionCreator";
import { Table, Tag, Button, Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { requests } from "../../../axios";
import { NavLink, useNavigate } from "react-router-dom";

import type { RootState } from "../../../redux";
import type { MapNews, News } from "../../../type/news";
import type { Columns } from "../../../type/columns";

const { confirm } = Modal;

export interface IAuditListProps {
  list: News[];
  getNewsList: Function;
}

function AuditList(props: IAuditListProps) {
  const navigate = useNavigate();

  const [auditList, setAuditList] = React.useState<MapNews[]>([]);
  const [columns, setColumns] = React.useState<Columns[]>([]);

  function filterAuditList(list: News[]): News[] {
    return list.filter((item) => {
      return item.auditState > 0 && item.publishState <= 1;
    });
  }
  function mapAuditList(list: News[]): MapNews[] {
    return list.map((item) => {
      return { ...item, key: item.id, categoryName: item.category.title };
    });
  }
  function revokeAudit(item: MapNews) {
    requests.patch(`/news/${item.id}`, { auditState: 0 }).then(() => {
      props.getNewsList();
      notification.success({
        message: <h4>通知</h4>,
        description: (
          <p>
            您可以到&nbsp;
            <span style={{ color: "#1890ff" }}>草稿箱</span>
            &nbsp;中查看您撤销的新闻
          </p>
        ),
      });
    });
  }
  function publishNews(item: MapNews) {
    requests
      .patch(`/news/${item.id}`, { publishState: 2, publishTime: Date.now() })
      .then(() => {
        props.getNewsList();
        notification.success({
          message: <h4>通知</h4>,
          description: (
            <p>
              您可以到&nbsp;
              <span style={{ color: "#1890ff" }}>已发布</span>
              &nbsp;中查看您发布的新闻
            </p>
          ),
        });
      });
  }
  function showConfirm(item: MapNews) {
    confirm({
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      title: (
        <span>
          确定要{item.auditState === 1 ? "撤销" : "发布"}&nbsp;
          <span style={{ color: "#1890ff" }}>{item.title}</span>
          &nbsp;吗?
        </span>
      ),
      onOk() {
        item.auditState === 1 ? revokeAudit(item) : publishNews(item);
      },
    });
  }
  function updateNews(item: MapNews) {
    navigate(`/update/${item.id}`);
  }

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
          title: "审核状态",
          dataIndex: "auditState",
          key: "auditState",
          render: (auditState: number) => {
            let auditStateName: string = "";
            let color: string = "";
            switch (auditState) {
              case 1:
                auditStateName = "审核中";
                color = "warning";
                break;
              case 2:
                auditStateName = "已通过";
                color = "success";
                break;
              case 3:
                auditStateName = "未通过";
                color = "error";
                break;
            }
            return <Tag color={color}>{auditStateName}</Tag>;
          },
        },
        {
          title: "操作",
          render: (item: MapNews) => {
            let handle: string = "";
            let type: any = "";
            switch (item.auditState) {
              case 1:
                handle = "撤销";
                type = "default";
                break;
              case 2:
                handle = "发布";
                type = "primary";
                break;
              case 3:
                handle = "修改";
                type = "primary";
                break;
            }
            return (
              <Button
                type={type}
                ghost={item.auditState === 2 ? true : false}
                danger={item.auditState === 2 ? true : false}
                onClick={() =>
                  item.auditState === 3 ? updateNews(item) : showConfirm(item)
                }
              >
                {handle}
              </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AuditList);
