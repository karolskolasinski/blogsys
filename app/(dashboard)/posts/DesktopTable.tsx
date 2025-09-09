"use client";

import Button from "@/components/blogsys/Button";
import EditIcon from "@/public/icons/blogsys/edit.svg";
import { deletePost } from "@/actions/posts";
import DeleteIcon from "@/public/icons/blogsys/delete.svg";
import { Post, Role } from "@/types/common";
import { useActionState, useEffect } from "react";
import { initialActionState } from "@/lib/utils";
import Toast from "@/components/blogsys/Toast";
import { useRouter } from "next/navigation";

type DesktopTableProps = {
  posts?: Post[];
  userId?: string;
  role?: Role;
};

export function DesktopTable(props: Readonly<DesktopTableProps>) {
  const { posts, userId, role } = props;
  const [state, formAction] = useActionState(deletePost, initialActionState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="hidden lg:block">
      <Toast success={state.success} messages={state.messages} />
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
            const canEdit = post.authorId === userId || role === "admin";

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
                        <form action={formAction}>
                          <input type="hidden" name="id" defaultValue={post.id} />
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
  );
}
