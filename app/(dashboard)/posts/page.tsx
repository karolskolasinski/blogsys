import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import Link from "next/link";
import { getPosts } from "@/actions/posts";
import ErrorMessage from "@/components/ErrorMessage";
import PostsTable from "@/components/PostsTable";
import { ServerComponentProps } from "@/types/common";

export default async function Posts(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }
  const params = await props.searchParams; // todo: flash message

  let content;
  try {
    const posts = await getPosts();
    content = <PostsTable posts={posts} />;
  } catch (err) {
    console.log(err);
    content = <ErrorMessage err={err} />;
  }

  return (
    <main className="flex-1 flex w-full text-sm">
      <DashboardMenu />

      <section className="p-4 flex-1">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Wpisy</h1>

          <Link
            href="/posts/new"
            className="button !bg-transparent !p-1 !py-1.5 !h-fit !font-normal"
          >
            Dodaj wpis
          </Link>
        </div>

        <div className="pt-10 overflow-x-auto">
          {content}
        </div>
      </section>
    </main>
  );
}
