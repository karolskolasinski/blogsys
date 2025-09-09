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

type MobileCardsProps = {
  posts?: Post[];
  userId?: string;
  role?: Role;
};

export function MobileCards(props: Readonly<MobileCardsProps>) {
  const { posts, userId, role } = props;
  const [state, formAction] = useActionState(deletePost, initialActionState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="lg:hidden bg-white">
      <Toast success={state.success} messages={state.messages} />
      {posts?.map((post) => {
        if (!post) {
          return null;
        }

        const canEdit = post.authorId === userId || role === "admin";

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
                  <form action={formAction} className="inline">
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
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
