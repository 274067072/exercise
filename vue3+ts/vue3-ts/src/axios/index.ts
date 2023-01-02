import { requests } from "./requests";

interface LoginData {
  username: String;
  password: String;
}
export const reqLogin = (data: LoginData) => {
  return requests({
    method: "post",
    url: "/login",
    data,
  });
};
export const reqGoodsList = () => {
  return requests({
    method: "get",
    url: "/getGoodsList",
  });
};
export const reqUserList = () => {
  return requests({
    method: "get",
    url: "/getUserList",
  });
};
export const reqRoleList = () => {
  return requests({
    method: "get",
    url: "/getRoleList",
  });
};
export const reqAuthorityList = () => {
  return requests({
    method: "get",
    url: "/getAuthorityList",
  });
};
