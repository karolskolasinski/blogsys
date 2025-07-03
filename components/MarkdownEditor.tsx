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
import { savePost } from "@/actions/posts";
import { redirect } from "next/navigation";
import { Post } from "@/types/common";

type MarkdownEditorProps = {
  post: Post;
};

export default function MarkdownEditor(props: MarkdownEditorProps) {
  const { content, tags } = props.post;
  const [value, setValue] = useState(content ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tagsArr, setTagsArr] = useState<string[]>([]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTagsArr([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (toRemove: string) => {
    setTagsArr(tags.filter((tag) => tag !== toRemove));
  };

  const savePost = async () => {
    if (!value || !tags) {
      return;
    }
    await savePost(value, tags);
    setValue("");
    setTagsArr([]);
    redirect("/posts");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 justify-between items-center mb-4">
        <input
          type="text"
          className="flex-1 border text-2xl font-bold rounded px-2"
          value={props.post.title ?? "Nowy wpis"}
          placeholder="Tytuł wpisu"
        />
        <button onClick={savePost} className="button w-fit">Zapisz</button>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Tagi:</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tagsArr.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-200 rounded-full flex items-center">
              {tag}
              <button
                onClick={() =>
                  removeTag(tag)}
                className="ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="border p-2 rounded w-full"
          placeholder="Wpisz tag i naciśnij Enter"
        />
      </div>

      <div className="h-full flex gap-4 overflow-hidden">
        <div className="flex-1 h-full rounded-lg overflow-auto">
          <Editor
            value={value}
            onValueChange={setValue}
            highlight={(code) => highlight(code, languages.markdown, "markdown")}
            padding={16}
            style={{
              fontFamily: '"Fira Code", monospace',
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

        <div
          className="hidden lg:block flex-1 p-4 border border-gray-500 rounded-lg overflow-auto"
          id="preview"
        >
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
  );
}
