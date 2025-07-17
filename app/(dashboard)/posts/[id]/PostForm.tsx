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
import "prismjs/themes/prism-twilight.min.css";
import { savePost } from "@/actions/posts";
import { Post } from "@/types/common";
import XIcon from "@/public/icons/x.svg";
import SendIcon from "@/public/icons/send.svg";
import PhotoIcon from "@/public/icons/photo.svg";
import EditIcon from "@/public/icons/edit.svg";
import AboutMarkdown from "./AboutMarkdown";
import Button from "@/components/Button";

type PostFormProps = {
  post: Post;
  globalTags: string[];
};

export default function PostForm(props: PostFormProps) {
  const { post, globalTags } = props;
  const [value, setValue] = useState(post.content);
  const [tags, setTags] = useState<string[]>(post.tags);
  const [tagInput, setTagInput] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(post.cover || null);

  function addTag() {
    if (tags.length >= 3) return;
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag]);
    }
    setTagInput("");
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  function removeTag(toRemove: string) {
    setTags((prev) => prev.filter((t) => t !== toRemove));
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Plik jest za duży! Maksymalny rozmiar to 1MB.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Wybierz plik obrazu!");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  }

  return (
    <form
      action={async (formData) => await savePost(formData)}
      className="px-4 pt-8 flex flex-col gap-2 bg-slate-50 border-t border-gray-200"
    >
      <input type="hidden" name="id" defaultValue={post.id} />
      <div className="flex justify-between items-center gap-4">
        <input
          name="title"
          className="w-full text-3xl font-black focus:bg-white rounded-lg"
          defaultValue={post.title}
          placeholder="Wpisz tytuł"
          maxLength={100}
          required
        />

        <Button
          href=""
          role="button"
          label="Opublikuj"
          icon={<SendIcon className="w-5 h-5 fill-white" />}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap text-sm text-gray-700">
        <input name="createdAt" type="hidden" value={post.createdAt?.toISOString()} />
        <div className="h-8 flex items-center">
          Data utworzenia: {post.createdAt?.toLocaleString()}
        </div>
        <span className="text-gray-300 font-black">•</span>
        <div className="h-8 flex items-center">
          Ostatnio edytowany: {post.updatedAt?.toLocaleString()}
        </div>

        {tags.length > 0 && <span className="text-gray-300 font-black">•</span>}
        {tags.map((tag) => (
          <div
            key={tag}
            className="px-2 py-1 bg-primary-50 border border-primary-200 rounded-lg flex items-center text-primary-700"
            title="Możesz dodać maksymalnie 3 tagi"
          >
            <input type="hidden" name="tags[]" value={tag} />
            <span className="mr-2">{tag}</span>
            <div title="Usuń">
              <XIcon
                className="w-4 h-4 cursor-pointer fill-gray-500 hover:fill-red-400"
                onClick={() => removeTag(tag)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex gap-8 py-4">
        <div className="flex-1 h-full flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              list="tag"
              name="tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleEnter}
              maxLength={20}
              className="flex-1 bg-white p-2 border border-gray-300 rounded-lg shadow disabled:cursor-not-allowed"
              placeholder={tags.length >= 3 ? "Możesz dodać maksymalnie 3 tagi" : "Wpisz tag"}
              title="Możesz dodać maksymalnie 3 tagi"
              disabled={tags.length >= 3}
            />
            <datalist id="tag">
              {globalTags.map((tag) => <option key={tag} value={tag} />)}
            </datalist>

            <button
              type="button"
              onClick={addTag}
              className="button disabled:opacity-30 disabled:!translate-0"
              title="Możesz dodać maksymalnie 3 tagi"
              disabled={tags.length >= 3}
            >
              Dodaj
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <label
              htmlFor="cover"
              className="button flex-1 whitespace-nowrap overflow-hidden text-shadow-md bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: coverPreview ? `url(${coverPreview})` : undefined,
                borderColor: "transparent",
              }}
            >
              <div className="flex gap-2 p-1 rounded bg-gray-800">
                <PhotoIcon className="w-5 h-5 fill-white" />
                {coverPreview ? "Zmień okładkę" : "Dodaj okładkę"}
              </div>
              <input
                id="cover"
                name="cover"
                type="file"
                accept="image/jpeg, image/png, image/gif, image/webp"
                className="hidden"
                onChange={handleCoverChange}
              />
            </label>
          </div>

          <div className="relative flex flex-1">
            <Editor
              placeholder="Wpisz treść"
              name="content"
              value={value}
              onValueChange={setValue}
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
        </div>

        <div
          className="hidden flex-1 min-h-[calc(100vh-250px)] lg:block p-4 border border-gray-300 rounded-xl shadow"
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
