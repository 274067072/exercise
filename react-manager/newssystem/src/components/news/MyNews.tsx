import * as React from "react";
import { PageHeader, Steps, Button, message, notification } from "antd";
import NewsForm from "./NewsForm";
import NewsContent from "./NewsContent";
import { requests } from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

import type { FormInfo } from "../../type/categories";
import type { News } from "../../type/news";

export interface IMyNewsProps {
  getNewsList: Function;
  pageHeaderTitle: string;
}

export default function MyNews(props: IMyNewsProps) {
  const { region, username, roleId } = JSON.parse(
    localStorage.getItem("token") as string
  );

  const navigate = useNavigate();
  const params = useParams();

  const [current, setCurrent] = React.useState<number>(0);
  const NewsFormRef = React.useRef<any>(null);
  const [content, setContent] = React.useState<string>("");
  const [formInfo, setFormInfo] = React.useState<FormInfo>();
  const [news, setNews] = React.useState<News>();

  function changeStep(number: number) {
    if (current === 0) {
      NewsFormRef.current
        ?.validateFields()
        .then((res: FormInfo) => {
          setFormInfo(res);
          setCurrent(current + number);
        })
        .catch(() => {
          return;
        });
    } else if (current === 1 && number > 0) {
      content && content.trim() !== "<p></p>"
        ? setCurrent(current + number)
        : message.error("新闻内容不能为空!");
    } else {
      setCurrent(current + number);
    }
  }
  function saveContent(content: string) {
    setContent(content);
  }
  function handlePageChange(auditState: number) {
    props.getNewsList();
    const description = auditState === 0 ? "草稿箱" : "审核列表";
    notification.success({
      message: <h4>通知</h4>,
      description: (
        <p>
          您可以到&nbsp;
          <span style={{ color: "#1890ff" }}>{description}</span>
          &nbsp;中查看您的新闻
        </p>
      ),
    });
    navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list");
  }
  function handleSave(auditState: number) {
    const news = {
      ...formInfo,
      content: content,
      region: region,
      author: username,
      roleId: roleId,
      auditState: auditState,
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0,
      publishTime: 0,
    };
    if (params.id) {
      requests.patch(`/news/${params.id}`, news).then(() => {
        handlePageChange(auditState);
      });
    } else {
      requests.post("/news", news).then(() => {
        handlePageChange(auditState);
      });
    }
  }

  React.useEffect(() => {
    if (params.id) {
      requests.get(`/news/${params.id}`).then((res) => {
        const news: News = res.data;
        NewsFormRef.current.setFieldsValue({
          title: news.title,
          categoryId: news.categoryId,
        });
        setNews(news);
      });
    }
  }, []);

  return (
    <>
      <PageHeader
        className="site-page-header"
        title={props.pageHeaderTitle}
        onBack={params.id ? () => navigate(-1) : undefined}
      />
      <Steps
        current={current}
        items={[
          {
            title: "基本信息",
            description: "新闻标题，新闻分类",
          },
          {
            title: "新闻内容",
            description: "新闻主题内容",
          },
          {
            title: "新闻提交",
            description: "保存草稿或提交审核",
          },
        ]}
        style={{ marginBottom: "40px" }}
      />
      <NewsForm
        forwardRef={NewsFormRef}
        style={current === 0 ? { display: "block" } : { display: "none" }}
      />
      <NewsContent
        style={current === 1 ? { display: "block" } : { display: "none" }}
        saveContent={saveContent}
        editorState={news?.content}
      />
      <div style={{ float: "right", marginTop: "40px" }}>
        {current > 0 && (
          <Button
            onClick={() => {
              changeStep(-1);
            }}
          >
            上一步
          </Button>
        )}
        {current < 2 && (
          <Button
            type="primary"
            onClick={() => {
              changeStep(1);
            }}
            style={{ marginLeft: "5px" }}
          >
            下一步
          </Button>
        )}
        {current >= 2 && (
          <>
            <Button
              type="primary"
              style={{ marginLeft: "5px" }}
              onClick={() => handleSave(0)}
            >
              保存草稿箱
            </Button>
            <Button
              type="primary"
              danger
              style={{ marginLeft: "5px" }}
              onClick={() => handleSave(1)}
            >
              提交审核
            </Button>
          </>
        )}
      </div>
    </>
  );
}
