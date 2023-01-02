import * as React from "react";
import { Form, Input, Select } from "antd";
import { requests } from "../../axios";

import type { MapUser, Value } from "../../type/userList";
import type { MapRegion } from "../../type/regionList";
import type { MapRole } from "../../type/roleList";

export interface IAddUserFormProps {
  regionList: MapRegion[];
  roleList: MapRole[];
  changeIsModalOpen: Function;
  getUserList: Function;
  forwardRef: any;
  updateItem?: MapUser;
}

export default function UserForm(props: IAddUserFormProps) {
  const { region, roleId } = JSON.parse(
    localStorage.getItem("token") as string
  );

  const [regionList, setRegionList] = React.useState<MapRegion[]>([]);
  const [roleList, setRoleList] = React.useState<MapRole[]>([]);
  const [isRoleListSelectable, setIsRoleListSelectable] =
    React.useState<boolean>(true);
  const [isRegionListSelectable, setIsRegionListSelectable] =
    React.useState<boolean>(true);
  const [isAllowClear] = React.useState<boolean>(roleId === 1);

  async function addUser(value: Value) {
    const newUser = {
      ...value,
      roleState: true,
      default: false,
    };
    await requests.post("/users", { ...newUser });
    props.changeIsModalOpen();
    props.getUserList();
  }
  async function updateUser(value: Value) {
    await requests.patch(`/users/${props.updateItem?.id}`, value);
    props.changeIsModalOpen();
    props.getUserList();
  }
  function remakeSelectList() {
    const NewRoleList = props.roleList.map((item) => ({
      ...item,
      disabled: false,
    }));
    setRoleList(NewRoleList);
    const newRegionList = props.regionList.map((item) => ({
      ...item,
      disabled: false,
    }));
    setRegionList(newRegionList);
  }
  function handleRegionChange(value: string) {
    if (roleId === 1) {
      if (value === "全球") {
        setIsRoleListSelectable(false);
        props.forwardRef.current?.setFieldValue("roleId", 1);
      } else if (value) {
        const value = props.forwardRef.current?.getFieldValue("roleId");
        if (value === 1) {
          props.forwardRef.current?.resetFields(["roleId"]);
        }
        setRoleList(mapWhichRoleSelectable(false));
        setIsRoleListSelectable(true);
      } else {
        props.forwardRef.current?.resetFields(["region", "roleId"]);
        remakeSelectList();
        remakeIsSelectable(true, true);
      }
    }
  }
  function handleRoleChange(value: number) {
    if (roleId === 1) {
      if (value === 1) {
        setIsRegionListSelectable(false);
        props.forwardRef.current?.setFieldValue("region", "全球");
      } else if (value) {
        const value = props.forwardRef.current?.getFieldValue("region");
        if (value === "全球") {
          props.forwardRef.current?.resetFields(["region"]);
        }
        setRegionList(mapWhichRegionSelectable(false));
        setIsRegionListSelectable(true);
      } else {
        props.forwardRef.current?.resetFields(["region", "roleId"]);
        remakeSelectList();
        remakeIsSelectable(true, true);
      }
    }
  }
  function mapWhichRegionSelectable(isGlobal: boolean): MapRegion[] {
    return regionList.map((item) => {
      return item.label === "全球"
        ? { ...item, disabled: !isGlobal }
        : { ...item, disabled: isGlobal };
    });
  }
  function mapWhichRoleSelectable(isGlobal: boolean): MapRole[] {
    return roleList.map((item) => {
      return item.id === 1
        ? { ...item, disabled: !isGlobal }
        : { ...item, disabled: isGlobal };
    });
  }
  function mapWhichRoleSelectableAccordingToRights(list: MapRole[]): MapRole[] {
    return list.map((item) => {
      if (item.id > roleId) {
        return { ...item, disabled: false };
      }
      return { ...item, disabled: true };
    });
  }
  function remakeIsSelectable(
    isRegionSelectable: boolean,
    isRoleSelectable: boolean
  ) {
    setIsRegionListSelectable(isRegionSelectable);
    setIsRoleListSelectable(isRoleSelectable);
  }
  function initFormAccordingToRights() {
    if (roleId !== 1) {
      remakeIsSelectable(false, true);
      setRoleList(mapWhichRoleSelectableAccordingToRights(props.roleList));
    } else {
      remakeSelectList();
      remakeIsSelectable(true, true);
    }
  }
  function remakeUpdateForm() {
    initFormAccordingToRights();
  }
  function remakeForm() {
    initFormAccordingToRights();
    if (roleId !== 1) {
      setTimeout(() => {
        props.forwardRef.current?.setFieldValue("region", region);
      });
    }
  }

  React.useEffect(() => {
    setRegionList(props.regionList);
  }, [props.regionList]);
  React.useEffect(() => {
    setRoleList(props.roleList);
  }, [props.roleList]);
  React.useEffect(() => {
    if (props.updateItem) {
      remakeUpdateForm();
    } else {
      remakeForm();
    }
  }, [props]);

  return (
    <Form
      ref={props.forwardRef}
      name="addUser"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      autoComplete="off"
      onFinish={(value) =>
        props.updateItem ? updateUser(value) : addUser(value)
      }
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请填写用户名!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: "请填写密码!" }]}
      >
        <Input.Password autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="区域"
        name="region"
        rules={[{ required: true, message: "请选择区域!" }]}
      >
        <Select
          allowClear={isAllowClear}
          placeholder="请选择区域"
          onChange={(value) => handleRegionChange(value)}
          options={regionList}
          disabled={!isRegionListSelectable}
        />
      </Form.Item>
      <Form.Item
        label="角色"
        name="roleId"
        rules={[{ required: true, message: "请选择角色!" }]}
      >
        <Select
          allowClear={isAllowClear}
          placeholder="请选择角色"
          onChange={(value) => handleRoleChange(value)}
          options={roleList}
          disabled={!isRoleListSelectable}
        />
      </Form.Item>
    </Form>
  );
}
