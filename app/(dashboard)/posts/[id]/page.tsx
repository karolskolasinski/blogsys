import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import MarkdownEditor from "@/components/MarkdownEditor";
import { getPost } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import ErrorMessage from "@/components/ErrorMessage";
import Breadcrumb from "@/components/Breadcrumb";

export default async function Posts(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  let content;
  let title = "Nowy wpis";
  const params = await props.params;
  const id = params.id as string;
  try {
    const post = await getPost(id);
    if (post.title) {
      title = post.title;
    }
    content = <MarkdownEditor post={post} />;
  } catch (err) {
    content = <ErrorMessage err={err} />;
  }

  return (
    <main className="flex w-full h-screen">
      <DashboardMenu active="/posts" />

      <section className="p-4 flex-1 flex flex-col">
        <Breadcrumb
          items={[{ label: "Wpisy", href: "/posts" }, { label: title, href: `/posts/${id}` }]}
        />
        {content}
      </section>
    </main>
  );
}
