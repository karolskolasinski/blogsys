import ChevronIcon from "@/public/icons/blogsys/chevron-right.svg";

type AuthorSelectProps = {
  author?: string;
  allAuthors?: { id: string; name: string }[];
  setAuthor: (v: string) => void;
};

export default function AuthorSelect(props: Readonly<AuthorSelectProps>) {
  const { author, allAuthors, setAuthor } = props;

  return (
    <div className="relative inline-block">
      <select
        id="authorId"
        name="authorId"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full bg-white p-2 pr-8 border border-gray-300 rounded-lg shadow appearance-none"
        title="Autor"
      >
        <option disabled>Autor</option>
        {allAuthors?.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <ChevronIcon className="w-5 h-5 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform rotate-90" />
    </div>
  );
}
