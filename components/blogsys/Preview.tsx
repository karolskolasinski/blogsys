import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Markdown from "react-markdown";
import CodeComponent from "@/components/blogsys/CodeComponent";

type PreviewProps = {
  value?: string;
};

export default function Preview(props: Readonly<PreviewProps>) {
  return (
    <div
      className="hidden flex-1 min-h-[calc(100vh-250px)] lg:block p-4 border border-gray-300 rounded-xl shadow"
      id="preview"
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ code: CodeComponent }}
      >
        {props?.value ?? ""}
      </Markdown>
    </div>
  );
}
