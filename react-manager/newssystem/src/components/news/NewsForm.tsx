import * as React from "react";
import { Form, Input, Select } from "antd";
import { connect } from "react-redux";

import type { RootState } from "../../redux";
import type { Categories, MapCategories } from "../../type/categories";

export interface INewsFormProps {
  categoriesList: Categories[];
  forwardRef: any;
  style: any;
}

function NewsForm(props: INewsFormProps) {
  const [categoriesList, setCategoriesList] = React.useState<MapCategories[]>(
    []
  );

  function mapCategoriesList(list: Categories[]): MapCategories[] {
    return list.map((item) => {
      return { label: item.value, value: item.id, key: item.id };
    });
  }

  React.useEffect(() => {
    if (props.categoriesList.length) {
      setCategoriesList(mapCategoriesList(props.categoriesList));
    }
  }, [props.categoriesList]);

  return (
    <Form
      name="newsForm"
      autoComplete="off"
      style={props.style}
      ref={props.forwardRef}
    >
      <Form.Item
        label="新闻标题"
        name="title"
        rules={[{ required: true, message: "请输入新闻标题!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="新闻分类"
        name="categoryId"
        rules={[{ required: true, message: "请选择新闻分类!" }]}
      >
        <Select options={categoriesList} />
      </Form.Item>
    </Form>
  );
}

function mapStateToProps(state: RootState) {
  return {
    categoriesList: state.newsCategoriesReducer,
  };
}

export default connect(mapStateToProps)(NewsForm);
