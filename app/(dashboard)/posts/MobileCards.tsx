import Button from "@/components/blogsys/Button";
import EditIcon from "@/public/icons/blogsys/edit.svg";
import { deletePost } from "@/actions/posts";
import DeleteIcon from "@/public/icons/blogsys/delete.svg";
import { Post } from "@/types/common";

type MobileCardsProps = {
  posts?: Post[];
  userId?: string;
  role?: "admin" | "user";
};

export function MobileCards(props: MobileCardsProps) {
  const { posts, userId, role } = props;

  return (
    <div className="lg:hidden bg-white">
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
  );
}
