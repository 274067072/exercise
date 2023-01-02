export type MapRights = {
  id: number;
  key: string;
  title: string;
  grade: number;
  children?: MapRights[];
  pagepermisson?: number;
};