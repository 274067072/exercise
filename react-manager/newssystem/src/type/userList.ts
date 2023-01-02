import type { Role } from "./roleList";

export type User = {
  id: number;
  username: string;
  password: number;
  roleState: boolean;
  default: boolean;
  region: string;
  roleId: number;
  role: Role;
};
export type MapUser = User & {
  key: number;
  roleName: string;
};

export type Value = {
  password: string;
  region: string;
  roleId: number;
  username: string;
};
