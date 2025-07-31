import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { getAllAuthors, getAllTags, getPost } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import PostForm from "./PostForm";
import ErrorMsg from "@/components/blogsys/ErrorMsg";

export default async function Post(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const params = await props.params;
  const id = params.id as string;
  let errMsg = "";
  let post;
  let allTags;
  let allAuthors;

  try {
    [post, allTags, allAuthors] = await Promise.all([
      getPost(id),
      getAllTags(),
      getAllAuthors(),
    ]);
  } catch (err) {
    console.error(err);
    errMsg = err instanceof Error ? err.message : "Coś poszło nie tak";
  }

  return (
    <main className="flex w-full min-h-screen">
      <DashboardMenu active="/posts" />

      <section className="flex-1 h-full flex flex-col">
        <Breadcrumb
          items={[
            { label: "Wpisy", href: "/posts" },
            { label: post?.title ? "Edycja wpisu" : "Nowy wpis", href: `/posts/${id}` },
          ]}
        />

        {errMsg.length > 0
          ? <ErrorMsg errMsg={errMsg} />
          : <PostForm post={post!} allTags={allTags!} allAuthors={allAuthors!} />}
      </section>
    </main>
  );
}
