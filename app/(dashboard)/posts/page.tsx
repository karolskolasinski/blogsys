import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { db } from "@/lib/db";
import { Post } from "@/types/common";
import Link from "next/link";

export default async function Posts() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  const fields = ["title", "authorId", "createdAt", "updatedAt"];
  const snapshot = await db.collection("posts").select(...fields).get();
  const posts: Post[] = snapshot.docs.map((doc) => ({
    ...doc.data() as Post,
    id: doc.id,
  }));

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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="border-b border-b-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase">Tytuł</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Autor</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Data utworzenia</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Data aktualizacji</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="group odd:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    {post.name}
                    <div className="mt-1 flex gap-2 opacity-0 group-hover:opacity-100">
                      <button className="text-primary-600">Edytuj</button>
                      <span className="text-gray-400">|</span>
                      <button className="text-red-600">Usuń</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">{post.authorId}</td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">{post.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap align-top">{post.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
