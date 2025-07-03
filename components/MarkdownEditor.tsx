"use client";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

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

      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <textarea
            name="content"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 p-4 border rounded resize-none font-mono overflow-auto"
            placeholder="Treść wpisu w Markdown..."
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 border rounded overflow-auto">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ children, className }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return match
                    ? (
                      <SyntaxHighlighter PreTag="div" language={match[1]} style={tomorrow}>
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
    </div>
  );
}
