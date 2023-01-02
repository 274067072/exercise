import * as React from "react";
import { Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { requests } from "../../axios";
import { useNavigate } from "react-router-dom";

require("particles.js/particles");

export interface ILoginProps {}

export default function Login(props: ILoginProps) {
  const navigate = useNavigate();

  function onFinish(value: { username: string; password: string }) {
    requests
      .get(
        `/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`
      )
      .then((res) => {
        if (res.data.length) {
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          requests
            .patch(`/users/${res.data[0].id}`, { default: true })
            .then(() => {
              navigate("/home", { replace: true });
            });
        } else {
          message.error("用户名或密码错误！");
        }
      });
  }
  React.useEffect(() => {
    // @ts-ignore
    particlesJS.load("particles-js", "assets/particles.json");
  }, []);

  return (
    <div
      id="particles-js"
      style={{
        position: "relative",
        height: "100%",
        backgroundColor: "rgb(35,39,65)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          backgroundColor: "rgba(0,0,0,.5)",
        }}
      >
        <h1 style={{ textAlign: "center", paddingTop: "30px", color: "white" }}>
          全球新闻发布管理系统
        </h1>
        <Form
          name="basic"
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={(value) => onFinish(value)}
          autoComplete="off"
          style={{ width: "500px", height: "180px", padding: "0 40px" }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input placeholder="Username" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined />}
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 10 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
