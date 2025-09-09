import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { getAuthors, getPost, getTags } from "@/actions/posts";
import { ServerComponentProps } from "@/types/common";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import PostForm from "./PostForm";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";

export default async function Post(props: Readonly<ServerComponentProps>) {
  const params = await props.params;
  const id = params.id as string;
  const [postRes, tagsRes, authorsRes] = await Promise.all([
    getPost(id),
    getTags(),
    getAuthors(),
  ]);

  return (
    <main className="flex w-full min-h-screen">
      <DashboardMenu active="/posts" />

      <section className="flex-1 h-full flex flex-col">
        <div className="flex gap-2 justify-between items-center">
          <Breadcrumb
            items={[
              { label: "Wpisy", href: "/posts" },
              { label: postRes?.data?.title ? "Edycja wpisu" : "Nowy wpis", href: `/posts/${id}` },
            ]}
          />
          <HamburgerMenu active="/posts" />
        </div>

        <PostForm post={postRes?.data} allTags={tagsRes?.data} allAuthors={authorsRes?.data} />
      </section>
    </main>
  );
}
