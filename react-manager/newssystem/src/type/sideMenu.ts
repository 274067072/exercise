export type Rights = {
  id: number;
  key: string;
  title: string;
  pagepermisson?: number;
  grade: number;
  children?: Rights[];
  rightId?: number;
};

export type MapSideMenu = {
  id: number;
  key: string;
  label: string;
  pagepermisson?: number;
  grade: number;
  children?: MapSideMenu[];
  icon?:JSX.Element
};
