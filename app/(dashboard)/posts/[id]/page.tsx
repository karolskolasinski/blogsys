import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { getAllAuthors, getAllTags, getPost } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import Breadcrumb from "@/components/Breadcrumb";
import PostForm from "./PostForm";

export default async function Posts(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const params = await props.params;
  const id = params.id as string;
  const post = await getPost(id);
  const title = post.title ? "Edycja wpisu" : "Nowy wpis";
  const allTags = await getAllTags();
  const allAuthors = await getAllAuthors();

  return (
    <main className="flex w-full h-screen">
      <DashboardMenu active="/posts" user={session.user} />

      <section className="flex-1 h-full flex flex-col">
        <Breadcrumb
          items={[
            { label: "Wpisy", href: "/posts" },
            { label: title, href: `/posts/${id}` },
          ]}
        />

        <PostForm post={post} allTags={allTags} allAuthors={allAuthors} user={session.user} />
      </section>
    </main>
  );
}
