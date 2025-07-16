import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import Link from "next/link";
import { getPosts } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import Breadcrumb from "@/components/Breadcrumb";
import AddIcon from "@/public/icons/add.svg";
import PostsTable from "./PostsTable";

export default async function Posts(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  const params = await props.searchParams; // todo: flash message

  let posts;
  let errMsg = "";
  try {
    posts = await getPosts();
  } catch (err) {
    console.error(err);
    errMsg = err instanceof Error ? err.message : "Coś poszło nie tak";
  }

  return (
    <main className="flex-1 flex w-full">
      <DashboardMenu active="/posts" user={session.user} />

      <section className="flex-1 flex flex-col">
        <Breadcrumb items={[{ label: "Wpisy", href: "/posts" }]} />

        <div className="flex-1 bg-slate-50 p-4 pt-8 border-t border-gray-200">
          <div className="flex gap-4 items-center justify-between">
            <h1 className="text-3xl font-black">Wpisy</h1>

            <Link
              href="/posts/new"
              className="button !rounded-full md:!rounded-md"
            >
              <AddIcon className="w-5 h-5 fill-white" />
              <span className="hidden md:inline">Dodaj wpis</span>
            </Link>
          </div>

          {errMsg ? <div>{errMsg}</div> : <PostsTable posts={posts ?? []} />}
        </div>
      </section>
    </main>
  );
}
