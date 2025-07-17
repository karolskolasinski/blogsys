import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import { deletePost, getPosts } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import Breadcrumb from "@/components/Breadcrumb";
import AddIcon from "@/public/icons/add.svg";
import Button from "@/components/Button";
import EditIcon from "@/public/icons/edit.svg";
import DeleteIcon from "@/public/icons/delete.svg";

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

            <Button
              href="posts/new"
              role="button"
              label="Dodaj wpis"
              icon={<AddIcon className="w-5 h-5 fill-white" />}
            />
          </div>

          {errMsg
            ? <div className="h-40 flex items-center justify-center text-red-500">{errMsg}</div>
            : (
              <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 shadow">
                <table className="table-auto min-w-full divide-y divide-gray-200 bg-white border-collapse">
                  <thead className="border-b border-b-gray-300 font-semibold">
                    <tr className="text-left text-xs uppercase">
                      <th className="px-6 py-3">Tytuł</th>
                      <th className="px-6 py-3">Autor</th>
                      <th className="px-6 py-3">Data utworzenia</th>
                      <th className="px-6 py-3">Data aktualizacji</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts?.map((post) => (
                      <tr key={post.id} className="align-top">
                        <td className="px-6 py-4">
                          {post.title}
                          <div className="mt-2 flex gap-2 text-sm">
                            <Button
                              href={`/posts/${post.id}`}
                              role="link"
                              label="Edytuj"
                              icon={<EditIcon className="w-4 h-4 fill-current" />}
                              colorClass="text-sky-600 hover:text-sky-500"
                            />

                            <span className="text-gray-400">|</span>

                            <form
                              action={async () => {
                                "use server";
                                await deletePost(post.id!);
                              }}
                            >
                              <Button
                                href="delete"
                                role="link"
                                label="Usuń"
                                icon={<DeleteIcon className="w-4 h-4 fill-current" />}
                                colorClass="text-red-600 hover:text-red-500"
                              />
                            </form>
                          </div>
                        </td>

                        <td className="px-6 py-4">{post.authorName}</td>
                        <td className="px-6 py-4">{post.createdAt?.toLocaleString()}</td>
                        <td className="px-6 py-4">{post.updatedAt?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
