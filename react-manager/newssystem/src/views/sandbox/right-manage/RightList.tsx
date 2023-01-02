import * as React from "react";
import { connect } from "react-redux";
import { Table, Button, Tooltip, Modal, Popconfirm, Switch } from "antd";
import { Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { requests } from "../../../axios";
import { getSideMenuList } from "../../../redux/actionCreators/sideMenuListActionCreator";

import type { RootState } from "../../../redux";
import type { MapRights } from "../../../type/rightList";
import type { Rights } from "../../../type/sideMenu";
import type { Columns } from "../../../type/columns";

const { confirm } = Modal;

export interface IRightListProps {
  list: Rights[];
  getSideMenuList: Function;
}

function RightList(props: IRightListProps) {
  const [rightList, setRightList] = React.useState<MapRights[]>([]);
  const [columns, setColumns] = React.useState<Columns[]>([]);

  async function deleteRight(item: MapRights) {
    if (item.grade === 1) {
      await requests.delete(`/rights/${item.id}`);
    } else {
      await requests.delete(`/children/${item.id}`);
    }
    props.getSideMenuList();
  }
  async function onChange(item: MapRights) {
    const pagepermisson = item.pagepermisson ? 0 : 1;
    if (item.grade === 1) {
      await requests.patch(`/rights/${item.id}`, { pagepermisson });
    } else {
      await requests.patch(`/children/${item.id}`, { pagepermisson });
    }
    props.getSideMenuList();
  }
  function MapRights(list: Rights[]): MapRights[] {
    return list.map((item) => {
      const rightList = {
        id: item.id,
        key: item.key,
        title: item.title,
        grade: item.grade,
        pagepermisson: item.pagepermisson,
      };
      if (item.children?.length) {
        const children = MapRights(item.children);
        return { ...rightList, children };
      }
      return rightList;
    });
  }
  const showConfirm = (item: MapRights) => {
    confirm({
      title: (
        <span>
          确定要删除&nbsp;
          <span style={{ color: "#1890ff" }}>{item.title}</span>&nbsp;吗?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        deleteRight(item);
      },
    });
  };

  React.useEffect(() => {
    if (props.list.length) {
      const rightList = MapRights(props.list);
      setRightList(rightList);
    } else {
      setRightList([]);
    }
  }, [props.list]);
  React.useEffect(() => {
    if (rightList.length) {
      const columns = [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          render: (id: number) => (
            <p style={{ fontWeight: "700", margin: "0" }}>{id}</p>
          ),
        },
        {
          title: "权限名称",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "权限路径",
          dataIndex: "key",
          key: "key",
          render: (key: string) => <Tag color="orange">{key}</Tag>,
        },
        {
          title: "操作",
          render: (item: MapRights) => (
            <>
              <Tooltip title="删除">
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  danger
                  style={{ marginRight: "10px" }}
                  onClick={() => showConfirm(item)}
                />
              </Tooltip>
              <Popconfirm
                title={
                  <div style={{ width: "120px" }}>
                    <p
                      style={{
                        borderBottom: "1px solid #efefef",
                        lineHeight: "25px",
                      }}
                    >
                      调控台
                    </p>
                    <Switch
                      checked={item.pagepermisson ? true : false}
                      onChange={() => onChange(item)}
                      style={{ marginLeft: "70px" }}
                    />
                  </div>
                }
                icon=""
                style={{ padding: "0" }}
                disabled={item.pagepermisson === undefined ? true : false}
              >
                <Tooltip>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<EditOutlined />}
                    disabled={item.pagepermisson === undefined ? true : false}
                  />
                </Tooltip>
              </Popconfirm>
            </>
          ),
        },
      ];
      setColumns(columns);
    } else {
      setColumns([]);
    }
  }, [rightList]);

  return (
    <Table
      dataSource={rightList}
      columns={columns}
      pagination={{ pageSize: 6 }}
    />
  );
}

function mapStateToProps(state: RootState) {
  return {
    list: state.sideMenuListReducer,
  };
}
const mapDispatchToProps = {
  getSideMenuList,
};

export default connect(mapStateToProps, mapDispatchToProps)(RightList);
