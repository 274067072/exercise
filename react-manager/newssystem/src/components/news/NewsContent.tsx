import * as React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export interface INewsContentProps {
  style: any;
  saveContent: Function;
  editorState: string | undefined;
}

export default function NewsContent(props: INewsContentProps) {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  function onEditorStateChange(editorState: any) {
    setEditorState(editorState);
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    props.saveContent(content);
  }

  React.useEffect(() => {
    if (props.editorState) {
      const html = props.editorState;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        onEditorStateChange(editorState);
      }
    }
  }, [props.editorState]);
  
  return (
    <>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        editorStyle={{ height: "250px", border: "1px solid #F1F1F1" }}
        wrapperStyle={props.style}
      />
    </>
  );
}
