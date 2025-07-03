"use client";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism-okaidia.min.css";

export default function MarkdownEditor() {
  const [value, setValue] = useState("");

  const savePost = async () => {
    console.log(value);
    setValue("");
  };

  return (
    <div className="h-full flex flex-col ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Nowy wpis</h1>
        <button onClick={savePost} className="button w-fit">
          Zapisz
        </button>
      </div>

      <div className="flex-1 flex gap-4">
        <Editor
          value={value}
          onValueChange={(code) => setValue(code)}
          highlight={(code) => highlight(code, languages.markdown, "markdown")}
          padding={16}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 14,
            backgroundColor: "#2d2d2d",
            color: "#ccc",
            flex: 1,
            border: "1px solid #444",
            borderRadius: "4px",
          }}
          textareaClassName="editor__textarea"
          preClassName="editor__pre"
        />

        <div className="flex-1 p-4 border rounded">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ children, className }) {
                const match = /language-(\w+)/.exec(className || "");
                return match
                  ? (
                    <SyntaxHighlighter
                      PreTag="div"
                      language={match[1]}
                      style={tomorrow}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  )
                  : <code className={className}>{children}</code>;
              },
            }}
          >
            {value}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
