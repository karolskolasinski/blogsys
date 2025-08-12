import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { deletePost, getPosts } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import AddIcon from "@/public/icons/blogsys/add.svg";
import Button from "@/components/blogsys/Button";
import EditIcon from "@/public/icons/blogsys/edit.svg";
import DeleteIcon from "@/public/icons/blogsys/delete.svg";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";
import { auth } from "@/auth";
import Toast from "@/components/blogsys/Toast";

export default async function Posts(props: ServerComponentProps) {
  const params = await props.searchParams; // todo: flash message
  const session = await auth();

  const res = await getPosts();
  const posts = res.data;

  return (
    <main className="flex-1 flex w-full">
      <Toast success={res.success} messages={res.messages} />
      <DashboardMenu active="/posts" />

      <section className="flex-1 flex flex-col">
        <div className="flex gap-2 justify-between items-center max-w-screen">
          <Breadcrumb items={[{ label: "Wpisy", href: "/posts" }]} />
          <HamburgerMenu active="/posts" />
        </div>

        <div className="flex-1 bg-slate-50 p-4 pt-8 border-t border-gray-200">
          <div className="flex gap-4 items-center justify-between flex-wrap">
            <h1 className="text-3xl font-black">Wpisy</h1>

            <Button
              href="/posts/new"
              appearance="button"
              label="Dodaj wpis"
              icon={<AddIcon className="w-5 h-5 fill-white" />}
            />
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 shadow">
            {/* Mobile/Tablet cards */}
            <div className="lg:hidden bg-white">
              {posts?.map((post) => {
                if (!post) {
                  return null;
                }

                const canEdit = post.authorId === session?.user?.id ||
                  session?.user?.role === "admin";

                return (
                  <div key={post.id} className="border-b border-gray-200 p-4 last:border-b-0">
                    <div className="flex flex-col">
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      <div className="text-sm text-gray-500">Autor: {post.authorName}</div>
                      <div className="text-sm text-gray-500">
                        Utworzony: {post.createdAt?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Zaktualizowany: {post.updatedAt?.toLocaleString()}
                      </div>

                      {canEdit && (
                        <div className="flex flex-wrap gap-3 text-sm pt-4">
                          <Button
                            href={`/posts/${post.id}`}
                            appearance="link"
                            label="Edytuj"
                            icon={<EditIcon className="w-4 h-4 fill-current" />}
                            colorClass="text-sky-600 hover:text-sky-500"
                          />
                          <form
                            action={async () => {
                              "use server";
                              await deletePost(post.id!);
                            }}
                            className="inline"
                          >
                            <Button
                              href="delete"
                              appearance="link"
                              label="Usuń"
                              icon={<DeleteIcon className="w-4 h-4 fill-current" />}
                              colorClass="text-red-600 hover:text-red-500"
                            />
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block">
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
                  {posts?.map((post) => {
                    const canEdit = post.authorId === session?.user?.id ||
                      session?.user?.role === "admin";

                    return (
                      <tr key={post.id} className="align-top">
                        <td className="px-6 py-4">
                          {post.title}

                          {canEdit
                            ? (
                              <div className="mt-2 flex gap-2 text-sm">
                                <Button
                                  href={`/posts/${post.id}`}
                                  appearance="link"
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
                                    appearance="link"
                                    label="Usuń"
                                    icon={<DeleteIcon className="w-4 h-4 fill-current" />}
                                    colorClass="text-red-600 hover:text-red-500"
                                  />
                                </form>
                              </div>
                            )
                            : (
                              <div className="text-gray-400 text-sm">
                                Nie możesz edytować tego wpisu
                              </div>
                            )}
                        </td>

                        <td className="px-6 py-4">{post.authorName}</td>
                        <td className="px-6 py-4">{post.createdAt?.toLocaleString()}</td>
                        <td className="px-6 py-4">{post.updatedAt?.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
