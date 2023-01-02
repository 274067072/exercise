import * as React from "react";
import { connect } from "react-redux";
import { getUserList } from "../../../redux/actionCreators/userListActionCreator";
import { Table, Switch, Tooltip, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { requests } from "../../../axios";
import { getRegions } from "../../../redux/actionCreators/regionsActionCreator";
import UserForm from "../../../components/userlist/UserForm";

import type { RootState } from "../../../redux";
import type { MapUser, User } from "../../../type/userList";
import type { Columns } from "../../../type/columns";
import type { Region, MapRegion, RegionFilter } from "../../../type/regionList";
import type { MapRole, Role } from "../../../type/roleList";

const { confirm } = Modal;

export interface IUserListProps {
  list: User[];
  regionList: Region[];
  roleList: Role[];
  getUserList: Function;
  getRegions: Function;
}

function UserList(props: IUserListProps) {
  const [list, setList] = React.useState<MapUser[]>([]);
  const [columns, setColumns] = React.useState<Columns[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [regionList, setRegionList] = React.useState<MapRegion[]>([]);
  const [roleList, setRoleList] = React.useState<MapRole[]>([]);
  const FormRef = React.useRef<any>(null);
  const FormUpdateRef = React.useRef<any>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] =
    React.useState<boolean>(false);
  const [updateItem, setUpdateItem] = React.useState<MapUser>();
  const [regionFilterList, setRegionFilterList] = React.useState<
    RegionFilter[]
  >([]);

  const { region, roleId } = JSON.parse(
    localStorage.getItem("token") as string
  );

  async function deleteUser(item: MapUser) {
    await requests.delete(`/users/${item.id}`);
    props.getUserList();
  }
  async function ChangeRoleState(item: MapUser) {
    const roleState = !item.roleState;
    await requests.patch(`/users/${item.id}`, { roleState });
    props.getUserList();
  }
  function mapList(list: User[]): MapUser[] {
    return list.map((item) => {
      return { ...item, roleName: item.role.roleName, key: item.id };
    });
  }
  function mapFilterList(list: MapUser[]): MapUser[] {
    return list.filter((item) => {
      if (roleId === 1) {
        return item.roleId >= roleId;
      }
      return item.region === region && item.roleId >= roleId;
    });
  }
  function mapRegionList(list: Region[]): MapRegion[] {
    return list.map((item) => {
      return {
        ...item,
        label: item.title,
      };
    });
  }
  function mapRegionFilterList(list: Region[]): RegionFilter[] {
    return list.map((item) => {
      return {
        ...item,
        text: item.title,
      };
    });
  }
  function mapRoleList(list: Role[]): MapRole[] {
    return list.map((item) => {
      return { id: item.id, label: item.roleName, value: item.roleType };
    });
  }
  const showConfirm = (item: MapUser) => {
    confirm({
      title: (
        <span>
          确定要删除&nbsp;
          <span style={{ color: "#1890ff" }}>{item.username}</span>&nbsp;吗?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        deleteUser(item);
      },
    });
  };
  function changeIsModalOpen() {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      FormRef.current?.resetFields();
    }
  }
  function submitAddUserForm() {
    FormRef.current?.submit();
  }
  function changeIsUpdateModalOpen(item?: MapUser) {
    setIsUpdateModalOpen(!isUpdateModalOpen);
    if (item) {
      setUpdateItem(item);
      setTimeout(() => {
        FormUpdateRef.current.setFieldsValue({
          username: item.username,
          password: item.password,
          region: item.region,
          roleId: item.roleId,
        });
      });
    }
  }
  function submitUpdateUserForm() {
    FormUpdateRef.current?.submit();
  }

  React.useEffect(() => {
    props.getUserList();
    props.getRegions();
  }, []);
  React.useEffect(() => {
    if (props.list.length) {
      const list = mapFilterList(mapList(props.list));
      setList(list);
    } else {
      setList([]);
    }
  }, [props.list]);
  React.useEffect(() => {
    if (list.length && regionFilterList.length) {
      const columns = [
        {
          title: "区域",
          dataIndex: "region",
          key: "region",
          render: (region: string) => (
            <p style={{ fontWeight: "700", margin: "0" }}>{region}</p>
          ),
          filters: regionFilterList,
          onFilter: (value: string, record: MapUser) => record.region === value,
        },
        { title: "角色名称", dataIndex: "roleName", key: "roleName" },
        { title: "用户名", dataIndex: "username", key: "username" },
        {
          title: "用户状态",
          render: (item: MapUser) => (
            <Switch
              checked={item.roleState}
              onChange={() => ChangeRoleState(item)}
              disabled={item.default}
            />
          ),
        },
        {
          title: "操作",
          render: (item: MapUser) => (
            <>
              <Tooltip title="删除">
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  danger
                  style={{ marginRight: "10px" }}
                  onClick={() => showConfirm(item)}
                  disabled={item.default}
                />
              </Tooltip>
              <Tooltip title="编辑">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<EditOutlined />}
                  disabled={item.default}
                  onClick={() => changeIsUpdateModalOpen(item)}
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
  }, [list, regionFilterList]);
  React.useEffect(() => {
    if (props.regionList.length) {
      const regionList = mapRegionList(props.regionList);
      setRegionList(regionList);
      const regionFilterList = mapRegionFilterList(props.regionList);
      setRegionFilterList(regionFilterList);
    }
  }, [props.regionList]);
  React.useEffect(() => {
    if (props.roleList.length) {
      const roleList = mapRoleList(props.roleList);
      setRoleList(roleList);
    }
  }, [props.roleList]);

  return (
    <>
      <Button type="primary" onClick={() => changeIsModalOpen()}>
        添加用户
      </Button>
      <Modal
        centered
        title="添加用户"
        open={isModalOpen}
        onCancel={() => changeIsModalOpen()}
        onOk={() => submitAddUserForm()}
        okText="提交"
        cancelText="取消"
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          getUserList={props.getUserList}
          changeIsModalOpen={changeIsModalOpen}
          forwardRef={FormRef}
        />
      </Modal>
      <Modal
        centered
        title="更新用户"
        open={isUpdateModalOpen}
        onCancel={() => changeIsUpdateModalOpen()}
        onOk={() => submitUpdateUserForm()}
        okText="更新"
        cancelText="取消"
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          getUserList={props.getUserList}
          changeIsModalOpen={changeIsUpdateModalOpen}
          forwardRef={FormUpdateRef}
          updateItem={updateItem}
        />
      </Modal>
      <Table dataSource={list} columns={columns} pagination={{ pageSize: 6 }} />
    </>
  );
}

function mapStateToProps(state: RootState) {
  return {
    list: state.userListReducer.userList,
    regionList: state.userListReducer.regionList,
    roleList: state.roleListReducer,
  };
}
const mapDispatchToProps = {
  getUserList,
  getRegions,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
