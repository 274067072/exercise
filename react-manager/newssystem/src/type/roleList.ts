export type Role = {
  id: number;
  roleName: string;
  roleType: number;
  rights: string[];
  key?: number;
};
export type MapRole = {
  id: number;
  label: string;
  value: number;
  disabled?: boolean;
};
export type MapTreeData = {
  title: string;
  key: string;
  children?: MapTreeData[];
  disabled?: boolean;
};
