import type { Categories } from "./categories";

export type News = {
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
  category: Categories;
};
export type MapNews = News & {
  categoryName: string;
  key: number;
};
