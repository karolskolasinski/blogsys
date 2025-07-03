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

      <div className="h-full flex gap-4 overflow-hidden">
        <div className="flex-1 h-full rounded-lg overflow-auto">
          <Editor
            value={value}
            onValueChange={(code) => setValue(code)}
            highlight={(code) => highlight(code, languages.markdown, "markdown")}
            padding={16}
            style={{
              fontFamily: '"Fira Code", "Fira Mono", "Consolas", monospace',
              backgroundColor: "#1f2937",
              color: "#e5e7eb",
              minHeight: "100%",
              border: "none",
              lineHeight: "1.5",
            }}
            textareaClassName="outline-none resize-none"
            preClassName="overflow-auto"
          />
        </div>

        <div className="hidden lg:block flex-1 p-4 border rounded-lg overflow-auto" id="preview">
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
