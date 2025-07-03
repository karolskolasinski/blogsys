import Link from "next/link";
import { Post } from "@/types/common";

type PostsTableProps = {
  posts: Post[];
};

export default function PostsTable(props: PostsTableProps) {
  const { posts } = props;

  return (
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
              {post.title}
              <div className="mt-1 flex gap-2 opacity-0 group-hover:opacity-100">
                <Link href={`/posts/${post.id}`} className="text-primary-600">Edytuj</Link>
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
  );
}
