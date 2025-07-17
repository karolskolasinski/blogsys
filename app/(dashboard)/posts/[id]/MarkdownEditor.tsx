import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism-twilight.min.css";
import AboutMarkdown from "@/app/(dashboard)/posts/[id]/AboutMarkdown";

type MarkdownEditorProps = {
  value: string;
  setValue: (value: string) => void;
};

export default function MarkdownEditor(props: MarkdownEditorProps) {
  return (
    <div className="relative flex flex-1">
      <Editor
        placeholder="Wpisz treść"
        name="content"
        value={props.value}
        onValueChange={props.setValue}
        highlight={(code) => highlight(code, languages.markdown, "markdown")}
        padding={16}
        style={{
          fontFamily: '"Fira Code", monospace',
          backgroundColor: "white",
          lineHeight: "1.5",
          border: "1px solid #d1d5dc",
          borderRadius: ".75rem",
          overflow: "auto",
          flex: "1",
        }}
        textareaClassName="!border !border-transparent !rounded-xl"
      />

      <AboutMarkdown />
    </div>
  );
}
