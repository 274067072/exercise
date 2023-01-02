import * as React from "react";
import { connect } from "react-redux";
import { Table, Tooltip, Button, Modal, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  VerticalAlignTopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Columns } from "../../../type/columns";
import { requests } from "../../../axios";
import { getNewsList } from "../../../redux/actionCreators/newsListActionCreator";
import { NavLink, useNavigate } from "react-router-dom";

import type { News, MapNews } from "../../../type/news";
import type { RootState } from "../../../redux";

const { confirm } = Modal;

export interface INewsDraftProps {
  list: News[];
  getNewsList: Function;
}

function NewsDraft(props: INewsDraftProps) {
  const navigate = useNavigate();

  const [draftList, setDraftList] = React.useState<MapNews[]>([]);
  const [columns, setColumns] = React.useState<Columns[]>([]);

  function filterDraftList(list: News[]): News[] {
    return list.filter((item) => {
      return item.auditState === 0;
    });
  }
  function mapDraftList(list: News[]): MapNews[] {
    return list.map((item) => {
      return { ...item, key: item.id, categoryName: item.category.title };
    });
  }
  function showConfirm(item: MapNews, isDelete: boolean) {
    confirm({
      title: (
        <span>
          确定要{isDelete ? "删除" : "提交"}&nbsp;
          <span style={{ color: "#1890ff" }}>{item.title}</span>
          &nbsp;吗?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        isDelete ? deleteDraft(item) : submitNews(item);
      },
    });
  }
  function deleteDraft(item: MapNews) {
    requests.delete(`/news/${item.id}`).then(() => {
      props.getNewsList();
    });
  }
  function submitNews(item: News) {
    requests.patch(`/news/${item.id}`, { auditState: 1 }).then(() => {
      props.getNewsList();
      notification.success({
        message: <h4>通知</h4>,
        description: (
          <p>
            您可以到&nbsp;
            <span style={{ color: "#1890ff" }}>审核列表</span>
            &nbsp;中查看您提交审核的新闻
          </p>
        ),
      });
    });
  }

  React.useEffect(() => {
    if (props.list.length) {
      setDraftList(mapDraftList(filterDraftList(props.list)));
    } else {
      setDraftList([]);
    }
  }, [props.list]);
  React.useEffect(() => {
    if (draftList.length) {
      const columns = [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          render: (id: number) => {
            return <p style={{ fontWeight: "700", margin: "0px" }}>{id}</p>;
          },
        },
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
          key: "category",
        },
        {
          title: "操作",
          render: (item: MapNews) => {
            return (
              <>
                <Tooltip title="删除">
                  <Button
                    shape="circle"
                    icon={<DeleteOutlined />}
                    danger
                    style={{ marginRight: "10px" }}
                    onClick={() => showConfirm(item, true)}
                  />
                </Tooltip>
                <Tooltip title="编辑">
                  <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    style={{ marginRight: "10px" }}
                    onClick={() => navigate(`/update/${item.id}`)}
                  />
                </Tooltip>
                <Tooltip title="提交审核">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<VerticalAlignTopOutlined />}
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
  }, [draftList]);

  return <Table dataSource={draftList} columns={columns} />;
}

function mapStateToProps(state: RootState) {
  return { list: state.newsListReducer };
}
const mapDispatchToProps = {
  getNewsList,
};
export default connect(mapStateToProps, mapDispatchToProps)(NewsDraft);
