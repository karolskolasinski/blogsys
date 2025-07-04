import Link from "next/link";
import { Post } from "@/types/common";
import { deletePost } from "@/actions/posts";

type PostsTableProps = {
  posts: Post[];
};

export default function PostsTable(props: PostsTableProps) {
  const { posts } = props;

  return (
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

            <td className="px-6 py-4">{post.authorId}</td>
            <td className="px-6 py-4">{post.createdAt.toLocaleString()}</td>
            <td className="px-6 py-4">{post.updatedAt.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
