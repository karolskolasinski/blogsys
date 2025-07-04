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
import { Post } from "@/types/common";
import XIcon from "@/public/icons/x.svg";

type MarkdownEditorProps = {
  post: Post;
};

export default function MarkdownEditor(props: MarkdownEditorProps) {
  const post = props.post;
  const [value, setValue] = useState(post.content);
  const [tags, setTags] = useState<string[]>(post.tags);
  const [tagInput, setTagInput] = useState("");

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        setTags((prev) => [...prev, tag]);
      }
      setTagInput("");
    }
  }

  return (
    <form
      action={async (formData) => await savePost(formData)}
      className="h-full flex flex-col"
    >
      <input type="hidden" name="id" defaultValue={post.id} />

      <div className="flex gap-4 justify-between items-center mb-4">
        <input
          name="title"
          className="flex-1 border border-gray-500 text-2xl font-bold rounded px-2"
          defaultValue={post.title}
          placeholder="Tytuł wpisu"
          maxLength={100}
          required
        />
        <button type="submit" className="button w-fit">Opublikuj</button>
      </div>

      <input name="createdAt" type="hidden" value={post.createdAt.toISOString()} />
      <div>Data utworzenia: {post.createdAt.toLocaleString()}</div>

      <input name="updatedAt" type="hidden" value={post.updatedAt.toISOString()} />
      <div>Data edycji: {post.updatedAt.toLocaleString()}</div>

      <div className="mb-4 flex gap-4">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => addTag(e)}
          maxLength={20}
          className="flex-1 border p-2 rounded w-full"
          placeholder="Wpisz tag i naciśnij Enter"
        />

        <div className="flex gap-2 mb-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="px-2 py-1 bg-gray-100 rounded-xl flex items-center hover:bg-gray-200"
            >
              <input type="hidden" name="tags[]" value={tag} />
              <div className="mr-2">{tag}</div>
              <XIcon
                className="w-4 h-4 cursor-pointer hover:fill-red-500"
                onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="h-full flex gap-4 overflow-hidden">
        <div className="flex-1 h-full rounded-lg overflow-auto">
          <Editor
            name="content"
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
    </form>
  );
}
