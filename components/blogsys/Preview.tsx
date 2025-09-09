import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown from "react-markdown";
import dynamic from "next/dynamic";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false },
);

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
        components={{
          code({ children, className }) {
            const match = /language-(\w+)/.exec(className || "");
            return match
              ? (
                <SyntaxHighlighter PreTag="div" language={match[1]} style={tomorrow}>
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              )
              : <code className={className}>{children}</code>;
          },
        }}
      >
        {props?.value ?? ""}
      </Markdown>
    </div>
  );
}
