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
import PublishIcon from "@/public/icons/publish.svg";

type MarkdownEditorProps = {
  post: Post;
};

export default function MarkdownEditor(props: MarkdownEditorProps) {
  const post = props.post;
  const [value, setValue] = useState(post.content);
  const [tags, setTags] = useState<string[]>(post.tags);
  const [tagInput, setTagInput] = useState("");
  const [title, setTitle] = useState(post.title);

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
      className="h-full pt-8 flex flex-col"
    >
      <input type="hidden" name="id" defaultValue={post.id} />

      <div className="px-4 flex gap-4 justify-between items-center">
        <h1 className="text-3xl font-black mb-2">
          {title.length > 0 ? title : "Nowy Post"}
        </h1>

        <button type="submit" className="button w-fit">
          <PublishIcon className="w-5 h-5 fill-white" />
          Opublikuj
        </button>
      </div>

      <div className="px-4 flex items-center gap-2 text-sm text-gray-700">
        <input name="createdAt" type="hidden" value={post.createdAt?.toISOString()} />
        <div>Data utworzenia: {post.createdAt?.toLocaleString()}</div>
        <span className="text-gray-300 font-black">•</span>
        <input name="updatedAt" type="hidden" value={post.updatedAt?.toISOString()} />
        <div>Ostatnio edytowany: {post.updatedAt?.toLocaleString()}</div>
        {tags.length > 0 && <span className="text-gray-300 font-black">•</span>}

        <div className="flex gap-4">
          <div className="flex gap-2">
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
      </div>

      <div className="flex-1 p-4 mt-4 pt-8 flex gap-4 bg-slate-50 border border-gray-200">
        <div className="w-full h-full flex flex-col gap-4">
          <input
            name="title"
            className="w-full bg-white p-4 border border-gray-300 rounded-2xl shadow"
            defaultValue={post.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wpisz tytuł"
            maxLength={100}
            required
          />

          <input
            name="tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => addTag(e)}
            maxLength={20}
            className="w-full bg-white p-4 border border-gray-300 rounded-2xl shadow"
            placeholder="Wpisz tag i naciśnij Enter"
          />

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
              lineHeight: "1.5",
              borderRadius: "1rem",
              height: "100%",
              overflow: "auto",
            }}
            textareaClassName="h-full"
            preClassName="h-full"
          />
        </div>

        <div
          className="hidden w-full lg:block p-4 border border-gray-300 rounded-2xl overflow-auto bg-white shadow"
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
