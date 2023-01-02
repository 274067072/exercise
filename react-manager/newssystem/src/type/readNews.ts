export type OriginNews = {
  title: string;
  categoryId: number;
  content: string;
  region: string;
  author: string;
  roleId: number;
  auditState: number;
  publishState: number;
  createTime: number;
  star: number;
  view: number;
  id: number;
  publishTime: number;
};

export type ReadNews = {
  id: number;
  title: string;
  value: string;
  news: OriginNews[];
};
