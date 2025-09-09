import XIcon from "@/public/icons/blogsys/x.svg";
import { Post } from "@/types/common";

type PostMetaProps = {
  post?: Post;
  tags: string[];
  setTags: (fn: (prev: string[]) => string[]) => void;
};

export default function PostMeta(props: Readonly<PostMetaProps>) {
  const { post, tags, setTags } = props;
  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 flex-wrap md:items-center text-sm text-gray-700">
      <input name="createdAt" type="hidden" value={post?.createdAt?.toISOString()} />
      <div className="h-8 flex items-center">
        Data utworzenia: {post?.createdAt?.toLocaleString()}
      </div>
      <span className="text-gray-300 font-black hidden sm:inline content-center">•</span>
      <div className="h-8 flex items-center">
        Ostatnio edytowany: {post?.updatedAt?.toLocaleString()}
      </div>

      {tags.length > 0 && (
        <>
          <span className="text-gray-300 font-black hidden sm:inline content-center">•</span>
          <div className="flex gap-1 pt-2 sm:pt-0">
            {tags.map((tag) => (
              <div
                key={tag}
                className="px-2 py-1 bg-primary-50 border border-primary-200 rounded-lg flex items-center text-primary-700"
                title="Możesz dodać maksymalnie 3 tagi"
              >
                <input type="hidden" name="tags[]" value={tag} />
                <span className="mr-2">{tag}</span>
                <div title="Usuń">
                  <XIcon
                    className="w-4 h-4 cursor-pointer fill-gray-500 hover:fill-red-400"
                    onClick={() => removeTag(tag)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
