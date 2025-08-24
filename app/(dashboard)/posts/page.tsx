import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { getPosts } from "@/actions/posts";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import AddIcon from "@/public/icons/blogsys/add.svg";
import Button from "@/components/blogsys/Button";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";
import { auth } from "@/auth";
import Toast from "@/components/blogsys/Toast";
import { MobileCards } from "@/app/(dashboard)/posts/MobileCards";
import { DesktopTable } from "@/app/(dashboard)/posts/DesktopTable";

export default async function Posts() {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  const res = await getPosts();
  const posts = res.data;

  return (
    <main className="flex-1 flex w-full">
      <Toast success={res.success} messages={res.messages} />
      <DashboardMenu active="/posts" />

      <section className="flex-1 flex flex-col">
        <div className="flex gap-2 justify-between items-center max-w-screen">
          <Breadcrumb items={[{ label: "Wpisy", href: "/posts" }]} />
          <HamburgerMenu active="/posts" />
        </div>

        <div className="flex-1 bg-slate-50 p-4 pt-8 border-t border-gray-200">
          <div className="flex gap-4 items-center justify-between flex-wrap">
            <h1 className="text-3xl font-black">Wpisy</h1>

            <Button
              href="/posts/new"
              appearance="button"
              label="Dodaj wpis"
              icon={<AddIcon className="w-5 h-5 fill-white" />}
            />
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 shadow">
            <MobileCards posts={posts} userId={userId} role={role} />
            <DesktopTable posts={posts} userId={userId} role={role} />
          </div>
        </div>
      </section>
    </main>
  );
}
