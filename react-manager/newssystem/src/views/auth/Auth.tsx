import * as React from "react";
import NewsSandBox from "../sandbox/NewsSandBox";
import { Navigate } from "react-router-dom";

export interface IAuthProps {}

export default function Auth(props: IAuthProps) {
  const token = localStorage.getItem("token");
  return token ? <NewsSandBox /> : <Navigate to="/login" />;
}
