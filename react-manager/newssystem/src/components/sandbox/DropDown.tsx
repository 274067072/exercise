import * as React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Avatar } from "antd";
import style from "./sandbox.module.scss";
import { useNavigate } from "react-router-dom";
import { requests } from "../../axios";

import type { MenuProps } from "antd";

export interface IDropDownProps {}

export default function DropDown(props: IDropDownProps) {
  const navigate = useNavigate();
  const {
    id,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token") as string);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      requests.patch(`/users/${id}`, { default: false }).then(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
    }
  };
  const menu = {
    onClick,
    items: [
      {
        label: roleName as string,
        key: "1",
      },
      {
        danger: true,
        label: "退出",
        key: "logout",
      },
    ],
  };

  return (
    <Dropdown menu={menu} className={style.dropdown}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
          />
        </Space>
      </a>
    </Dropdown>
  );
}
