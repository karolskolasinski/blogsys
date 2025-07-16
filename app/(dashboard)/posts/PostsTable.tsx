import Link from "next/link";
import EditIcon from "@/public/icons/edit.svg";
import { deletePost } from "@/actions/posts";
import DeleteButton from "@/components/DeleteButton";
import { Post } from "@/types/common";

type PostsTableProps = {
  posts: Post[];
};

export default function PostsTable(props: PostsTableProps) {
  return (
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
          {props.posts?.map((post) => (
            <tr key={post.id} className="group align-top">
              <td className="px-6 py-4">
                {post.title}
                <div className="mt-2 flex gap-2 xl:opacity-0 group-hover:opacity-100 text-sm">
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex gap-1 items-center text-sky-600 hover:text-sky-500 duration-100"
                  >
                    <EditIcon className="w-4 h-4 fill-current" />
                    Edytuj
                  </Link>

                  <span className="text-gray-400">|</span>

                  <form
                    action={async () => {
                      "use server";
                      await deletePost(post.id!);
                    }}
                  >
                    <DeleteButton label="Czy na pewno chcesz usunąć ten wpis?" />
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
  );
}
