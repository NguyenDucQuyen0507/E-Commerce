import React, { useRef, memo } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MarkdownEditor = ({
  label,
  value,
  name,
  changValue,
  invalidateField,
  setInvalidateField,
}) => {
  return (
    <div className="flex flex-col">
      <span className="">{label}</span>
      <Editor
        apiKey={process.env.REACT_APP_MCTINY}
        initialValue={value}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onChange={(e) =>
          changValue((prev) => ({ ...prev, [name]: e.target.getContent() }))
        }
        onFocus={() => setInvalidateField && setInvalidateField([])}
      />
      {invalidateField?.some((el) => el.name === name) && (
        <small className="text-main text-sm">
          {invalidateField?.find((el) => el.name === name)?.mes}
        </small>
      )}
    </div>
  );
};
export default memo(MarkdownEditor);
