import * as React from "react";
import { Table, Tooltip, Button, Modal, Tree } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { getRoleList } from "../../../redux/actionCreators/roleListActionCreator";
import { requests } from "../../../axios";
import { getSideMenuList } from "../../../redux/actionCreators/sideMenuListActionCreator";

import type { RootState } from "../../../redux";
import type { MapTreeData, Role } from "../../../type/roleList";
import type { Columns } from "../../../type/columns";
import type { Rights } from "../../../type/sideMenu";

const { confirm } = Modal;

export interface IRoleListProps {
  list: Role[];
  treeData: Rights[];
  getRoleList: Function;
  getSideMenuList: Function;
}

function RoleList(props: IRoleListProps) {
  const [columns, setColumns] = React.useState<Columns[]>([]);
  const [list, setList] = React.useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [item, setItem] = React.useState<Role>();
  const [checkedKeys, setCheckedKeys] = React.useState<React.Key[]>([]);
  const [treeData, setTreeData] = React.useState<MapTreeData[]>([]);

  async function deleteRole(item: Role) {
    await requests.delete(`/roles/${item.id}`);
    props.getRoleList();
  }
  async function updateRights() {
    await requests.patch(`/roles/${(item as Role).id}`, {
      rights: checkedKeys,
    });
    handleIsModalOpen();
    props.getRoleList();
    props.getSideMenuList();
  }
  const showConfirm = (item: Role) => {
    confirm({
      title: (
        <span>
          确定要删除&nbsp;
          <span style={{ color: "#1890ff" }}>{item.roleName}</span>&nbsp;吗?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        deleteRole(item);
      },
    });
  };
  function mapList(list: Role[]) {
    return list.map((item) => {
      return { ...item, key: item.id };
    });
  }
  function mapTreeData(list: Rights[]): MapTreeData[] {
    return list.map((item) => {
      const newTreeData = item.pagepermisson
        ? { title: item.title, key: item.key }
        : { title: item.title, key: item.key, disabled: true };
      if (item.children?.length) {
        const children = mapTreeData(item.children);
        return { ...newTreeData, children };
      }
      return newTreeData;
    });
  }
  function handleIsModalOpen(item?: Role) {
    setIsModalOpen(!isModalOpen);
    if (item) {
      setItem(item);
      setCheckedKeys(props.list[item.id - 1].rights);
    }
  }
  function saveCheckedKeys(checkedKeys: {
    checked: React.Key[];
    halfChecked: React.Key[];
  }) {
    setCheckedKeys(checkedKeys.checked);
  }

  React.useEffect(() => {
    props.list.length ? setList(mapList(props.list)) : setList([]);
  }, [props.list]);
  React.useEffect(() => {
    props.treeData.length
      ? setTreeData(mapTreeData(props.treeData))
      : setTreeData([]);
  }, [props.treeData]);
  React.useEffect(() => {
    if (list.length) {
      const columns = [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          render: (id: number) => (
            <p style={{ fontWeight: "700", margin: "0" }}>{id}</p>
          ),
        },
        { title: "角色名称", dataIndex: "roleName", key: "roleName" },
        {
          title: "操作",
          render: (item: Role) => (
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
              <Tooltip>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<UnorderedListOutlined />}
                  onClick={() => {
                    handleIsModalOpen(item);
                  }}
                />
              </Tooltip>
            </>
          ),
        },
      ];
      setColumns(columns);
    } else {
      setColumns([]);
    }
  }, [list]);

  return (
    <>
      <Table dataSource={list} columns={columns} pagination={{ pageSize: 6 }} />
      <Modal
        title="编辑权限"
        open={isModalOpen}
        okText="确认"
        cancelText="取消"
        onOk={() => {
          updateRights();
        }}
        onCancel={() => {
          handleIsModalOpen();
        }}
      >
        <Tree
          checkable
          onCheck={(checkedKeys) => {
            saveCheckedKeys(
              checkedKeys as { checked: React.Key[]; halfChecked: React.Key[] }
            );
          }}
          checkedKeys={checkedKeys}
          treeData={treeData}
          checkStrictly
        />
      </Modal>
      ;
    </>
  );
}

function mapStateToProps(state: RootState) {
  return {
    list: state.roleListReducer,
    treeData: state.sideMenuListReducer,
  };
}
const mapDispatchToProps = {
  getRoleList,
  getSideMenuList,
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleList);
