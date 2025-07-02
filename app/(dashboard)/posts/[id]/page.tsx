import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/DashboardMenu";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default async function Posts() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }
  const markdown = `Here is some JavaScript code:

~~~js
console.log('It works!')
~~~
<div class="note">

Some *emphasis* and <strong>strong</strong>!

</div>`;

  return (
    <main className="flex-1 flex w-full text-sm">
      <DashboardMenu />

      <section className="p-4 flex-1">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Nowy wpis</h1>
        </div>

        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          children={markdown}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match
                ? (
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={dark}
                  />
                )
                : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
            },
          }}
        />
      </section>
    </main>
  );
}
