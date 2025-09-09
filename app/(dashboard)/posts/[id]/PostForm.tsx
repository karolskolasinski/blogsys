"use client";

import { useActionState, useEffect, useState } from "react";
import { savePost } from "@/actions/posts";
import { Post } from "@/types/common";
import Toast from "@/components/blogsys/Toast";
import { redirect } from "next/navigation";
import { initialActionState } from "@/lib/utils";
import { Cover } from "@/app/(dashboard)/posts/[id]/Cover";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import TagsInput from "./TagsInput";
import AuthorSelect from "./AuthorSelect";
import MarkdownEditor from "@/app/(dashboard)/posts/[id]/MarkdownEditor";
import Preview from "@/components/blogsys/Preview";

type PostFormProps = {
  post?: Post;
  allTags?: string[];
  allAuthors?: { id: string; name: string }[];
};

export default function PostForm(props: Readonly<PostFormProps>) {
  const { post, allTags, allAuthors } = props;
  const [title, setTitle] = useState(post?.title ?? "");
  const [value, setValue] = useState(post?.content ?? "");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const isValidAuthor = allAuthors?.some((a) => a.id === post?.authorId);
  const [author, setAuthor] = useState(isValidAuthor ? post?.authorId : "");
  const [state, formAction] = useActionState(savePost, initialActionState);

  useEffect(() => {
    if (state.success) {
      redirect("/posts");
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="px-4 pt-8 flex flex-col gap-2 bg-slate-50 border-t border-gray-200"
    >
      <Toast success={state.success} messages={state.messages} />
      <input type="hidden" name="id" defaultValue={post?.id ?? "new"} />

      <PostTitle title={title} setTitle={setTitle} />
      <PostMeta post={post} tags={tags} setTags={setTags} />

      <div className="flex-1 flex gap-8 py-4">
        <div className="flex-1 h-full flex flex-col gap-4 min-h-[calc(100vh-250px)]">
          <TagsInput tags={tags} allTags={allTags} setTags={setTags} />
          <AuthorSelect author={author} allAuthors={allAuthors} setAuthor={setAuthor} />
          <Cover cover={post?.cover} />
          <MarkdownEditor value={value} setValue={setValue} />
        </div>

        <Preview value={value} />
      </div>
    </form>
  );
}
