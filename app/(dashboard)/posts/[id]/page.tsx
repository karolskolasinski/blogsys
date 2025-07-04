import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import MarkdownEditor from "@/components/MarkdownEditor";
import { getPost } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import ErrorMessage from "@/components/ErrorMessage";

export default async function Posts(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  let content;
  try {
    const params = await props.params;
    const post = await getPost(params.id as string);
    content = <MarkdownEditor post={post} />;
  } catch (err) {
    content = <ErrorMessage err={err} />;
  }

  return (
    <main className="flex w-full text-sm h-screen">
      <DashboardMenu />

      <section className="p-4 flex-1 flex flex-col">
        {content}
      </section>
    </main>
  );
}
