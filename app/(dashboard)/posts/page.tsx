import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import Link from "next/link";
import { deletePost, getPosts } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import Breadcrumb from "@/components/Breadcrumb";
import AddIcon from "@/public/icons/add.svg";

export default async function Posts(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }
  const params = await props.searchParams; // todo: flash message
  const posts = await getPosts();

  return (
    <main className="flex-1 flex w-full">
      <DashboardMenu active="/posts" />

      <section className="p-4 flex-1">
        <Breadcrumb items={[{ label: "Wpisy", href: "/posts" }]} />

        <div className="flex gap-4 items-center justify-between">
          <h1 className="text-3xl font-black">Wpisy</h1>

          <Link
            href="/posts/new"
            className="button !bg-gray-800 text-white !border-black !rounded-full md:!rounded-md !p-2 !h-fit"
          >
            <AddIcon className="w-5 h-5 fill-white" />
            <span className="hidden md:inline">Dodaj wpis</span>
          </Link>
        </div>

        <div className="pt-10 overflow-x-auto">
          <table className="table-auto min-w-full divide-y divide-gray-200">
            <thead className="border-b border-b-gray-500 font-semibold">
              <tr className="text-left text-xs uppercase">
                <th className="px-6 py-3">Tytuł</th>
                <th className="px-6 py-3">Autor</th>
                <th className="px-6 py-3">Data utworzenia</th>
                <th className="px-6 py-3">Data aktualizacji</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="group odd:bg-gray-100 align-top">
                  <td className="px-6 py-4">
                    {post.title}
                    <div className="mt-1 flex gap-2 opacity-0 group-hover:opacity-100">
                      <Link href={`/posts/${post.id}`} className="text-primary-600">Edytuj</Link>
                      <span className="text-gray-400">|</span>
                      <form
                        action={async () => {
                          "use server";
                          await deletePost(post.id!);
                        }}
                      >
                        <button className="text-red-600 cursor-pointer">Usuń</button>
                      </form>
                    </div>
                  </td>

                  <td className="px-6 py-4">{post.authorName}</td>
                  <td className="px-6 py-4">{post.createdAt.toLocaleString()}</td>
                  <td className="px-6 py-4">{post.updatedAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
