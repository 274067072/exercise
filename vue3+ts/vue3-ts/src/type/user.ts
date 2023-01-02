export interface User {
  id: number;
  nickName: string;
  role: RoleInt[];
  userName: string;
}
interface RoleInt {
  role: number;
  roleName: string;
}
