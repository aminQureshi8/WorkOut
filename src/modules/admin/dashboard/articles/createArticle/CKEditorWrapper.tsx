"use client";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CKEditorWrapper({ value, onChange }: Props) {
  return (
    <CKEditor
      editor={
        ClassicEditor as unknown as ConstructorParameters<
          typeof import("@ckeditor/ckeditor5-react").CKEditor
        >[0]["editor"]
      }
      data={value}
      onChange={(_, editor) =>
        onChange((editor as InstanceType<typeof ClassicEditor>).getData())
      }
      config={{
        licenseKey: "GPL",
        language: "fa",
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "|",
          "undo",
          "redo",
        ],
      }}
    />
  );
}
