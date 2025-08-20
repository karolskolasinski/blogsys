import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { ServerComponentProps } from "@/types/common";
import { getUserById } from "@/actions/users";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";
import Toast from "@/components/blogsys/Toast";
import { SaveUser } from "@/app/(dashboard)/users/[id]/SaveUser";

export default async function User(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const params = await props.params;
  const res = await getUserById(params.id as string);
  const user = res?.data;
  const title = user?.name ? "Edycja użytkownika" : "Dodaj użytkownika";

  return (
    <main className="flex w-full h-screen">
      <Toast success={res.success} messages={res.messages} />
      <DashboardMenu active="/users" />

      <section className="flex-1 h-full flex flex-col">
        <div className="flex gap-2 justify-between items-center max-w-screen">
          <Breadcrumb
            items={[{ label: "Użytkownicy", href: "/users" }, {
              label: title,
              href: `/posts/${user?.id}`,
            }]}
          />
          <HamburgerMenu active="/users" />
        </div>

        <SaveUser user={user} />
      </section>
    </main>
  );
}
