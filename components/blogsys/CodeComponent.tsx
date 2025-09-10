import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import dynamic from "next/dynamic";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false },
);

export default function CodeComponent({ children, className }: React.ComponentProps<"code">) {
  const match = /language-(\w+)/.exec(className || "");

  if (match) {
    return (
      <SyntaxHighlighter PreTag="div" language={match[1]} style={tomorrow}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  }

  return <code className={className}>{children}</code>;
}
