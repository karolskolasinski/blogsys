import Button from "@/components/blogsys/Button";
import SendIcon from "@/public/icons/blogsys/send.svg";

type PostTitleProps = {
  title: string;
  setTitle: (v: string) => void;
};

export default function PostTitle(props: Readonly<PostTitleProps>) {
  const { title, setTitle } = props;

  return (
    <div className="flex justify-between items-center gap-4">
      <input
        name="title"
        className="w-full text-3xl font-black focus:bg-white rounded-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Wpisz tytuł"
        maxLength={100}
        required
      />
      <Button
        href=""
        appearance="button"
        label="Opublikuj"
        icon={<SendIcon className="w-5 h-5 fill-white" />}
      />
    </div>
  );
}
