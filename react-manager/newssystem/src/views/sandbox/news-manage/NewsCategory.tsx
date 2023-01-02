import * as React from "react";
import { connect } from "react-redux";
import { RootState } from "../../../redux";
import { Table, Tooltip, Button, Modal, Form, Input } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { requests } from "../../../axios";
import { getCategoriesList } from "../../../redux/actionCreators/categoriesActionCreator";
import "./newsCategory.scss";

import type { Categories, MapCategories } from "../../../type/categories";
import type { Columns } from "../../../type/columns";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/es/form";

const { confirm } = Modal;

export interface INewsCategoryProps {
  categoryList: Categories[];
  getCategoriesList: Function;
}

function NewsCategory(props: INewsCategoryProps) {
  const [columns, setColumns] = React.useState<Columns[]>([]);
  const [categoryList, setCategoryList] = React.useState<MapCategories[]>([]);

  function mapCategoryList(list: Categories[]): MapCategories[] {
    return list.map((item) => {
      return { label: item.title, value: item.id, key: item.id };
    });
  }
  function deleteCategory(item: MapCategories) {
    requests.delete(`/categories/${item.key}`).then(() => {
      props.getCategoriesList();
    });
  }
  function showConfirm(item: MapCategories) {
    confirm({
      title: (
        <span>
          确定要删除&nbsp;
          <span style={{ color: "#1890ff" }}>{item.label}</span>&nbsp;吗?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        deleteCategory(item);
      },
    });
  }
  const handleSave = (row: MapCategories) => {
    requests
      .patch(`/categories/${row.key}`, {
        title: row.label,
        value: row.label,
      })
      .then(() => {
        props.getCategoriesList();
      });
  };

  React.useEffect(() => {
    if (props.categoryList.length) {
      setCategoryList(mapCategoryList(props.categoryList));
    } else {
      setCategoryList([]);
    }
  }, [props.categoryList]);
  React.useEffect(() => {
    if (categoryList.length) {
      const defaultColumns = [
        {
          title: "ID",
          dataIndex: "key",
          key: "key",
          render: (key: number) => {
            return <p style={{ fontWeight: "700", margin: "0px" }}>{key}</p>;
          },
        },
        {
          title: "栏目名称",
          dataIndex: "label",
          key: "label",
          width: "50%",
          editable: true,
        },
        {
          title: "操作",
          render: (item: MapCategories) => (
            <Tooltip title="删除">
              <Button
                shape="circle"
                icon={<DeleteOutlined />}
                danger
                onClick={() => showConfirm(item)}
              />
            </Tooltip>
          ),
        },
      ];
      const columns = defaultColumns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: MapCategories) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
      });
      setColumns(columns);
    } else {
      setColumns([]);
    }
  }, [categoryList]);

  const EditableContext = React.createContext<FormInstance<any> | null>(null);
  interface EditableRowProps {
    index: number;
  }
  const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
  }
  interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
  }
  const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = React.useState(false);
    const inputRef = React.useRef<InputRef>(null);
    const form = React.useContext(EditableContext)!;

    React.useEffect(() => {
      if (editing) {
        inputRef.current!.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0, padding: 0, flex: 1 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div className="editable-cell-value-wrap" onClick={toggleEdit}>
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Table
      rowClassName={() => "editable-row"}
      components={components}
      dataSource={categoryList}
      columns={columns}
    />
  );
}

function mapStateToProps(state: RootState) {
  return {
    categoryList: state.newsCategoriesReducer,
  };
}
const mapDispatchToProps = {
  getCategoriesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsCategory);
