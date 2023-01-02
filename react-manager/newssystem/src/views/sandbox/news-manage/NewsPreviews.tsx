import React, { useState } from "react";
import { PageHeader, Descriptions } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { requests } from "../../../axios";
import dayjs from "dayjs";
import { HeartOutlined, HeartTwoTone } from "@ant-design/icons";

import type { News } from "../../../type/news";

export interface INewsPreviewsProps {
  detail?: boolean;
}

export default function NewsPreviews(props: INewsPreviewsProps) {
  const params = useParams();
  const navigate = useNavigate();

  const mapAuditState: Record<number, string> = {
    0: "未审核",
    1: "审核中",
    2: "已通过",
    3: "未通过",
  };
  const mapPublishState: Record<number, string> = {
    0: "未发布",
    1: "待发布",
    2: "已发布",
    3: "已下线",
  };
  const mapStateStyle: Record<number, string> = {
    0: "grey",
    1: "orange",
    2: "green",
    3: "red",
  };

  const [newsPreview, setNewsPreview] = React.useState<News>();
  const [like, setLike] = useState<number[]>([]);

  function getNews() {
    requests.get(`/news/${params.id}?_expand=category`).then((res) => {
      setNewsPreview(res.data);
    });
  }
  function handleLikeNews(num: number) {
    requests
      .patch(`/news/${params.id}`, {
        star: (newsPreview?.star as number) + num,
      })
      .then(() => {
        getNews();
        let newLike = [...like];
        num > 0
          ? newLike.push(newsPreview?.id as number)
          : newLike.splice(newLike.indexOf(newsPreview?.id as number), 1);
        localStorage.setItem("like", JSON.stringify(newLike));
        setLike(newLike);
      });
  }

  React.useEffect(() => {
    requests.get(`/news/${params.id}`).then((res) => {
      requests
        .patch(`/news/${params.id}`, { view: res.data.view + 1 })
        .then(() => {
          getNews();
        });
    });
    const likeNewsList: number[] = JSON.parse(
      localStorage.getItem("like") || "[]"
    );
    setLike(likeNewsList);
  }, []);

  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate(-1)}
        title={newsPreview?.title}
        subTitle={newsPreview?.category.title}
        tags={
          props.detail ? (
            like.includes(newsPreview?.id as number) ? (
              <HeartTwoTone
                twoToneColor="#eb2f96"
                onClick={() => {
                  handleLikeNews(-1);
                }}
              />
            ) : (
              <HeartOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleLikeNews(1);
                }}
              />
            )
          ) : undefined
        }
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者：">
            {newsPreview?.author}
          </Descriptions.Item>
          {!props.detail && (
            <Descriptions.Item label="创建时间：">
              {dayjs(newsPreview?.createTime).format("YYYY/MM/DD HH:mm:ss")}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="发布时间：">
            {newsPreview?.publishTime === 0
              ? "-"
              : dayjs(newsPreview?.publishTime).format("YYYY/MM/DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="区域：">
            {newsPreview?.region}
          </Descriptions.Item>
          {!props.detail && (
            <>
              <Descriptions.Item label="审核状态：">
                <span
                  style={{
                    color: mapStateStyle[newsPreview?.auditState as number],
                  }}
                >
                  {mapAuditState[newsPreview?.auditState as number]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态：">
                <span
                  style={{
                    color: mapStateStyle[newsPreview?.publishState as number],
                  }}
                >
                  {mapPublishState[newsPreview?.publishState as number]}
                </span>
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="访问数量：">
            {newsPreview?.view}
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量：">
            {newsPreview?.star}
          </Descriptions.Item>
          <Descriptions.Item label="评论数量：">0</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div
        style={{
          padding: "20px",
          border: "1px solid #F1F1F1",
          overflow: "auto",
        }}
      >
        <span
          dangerouslySetInnerHTML={{ __html: newsPreview?.content as string }}
        ></span>
      </div>
    </>
  );
}
