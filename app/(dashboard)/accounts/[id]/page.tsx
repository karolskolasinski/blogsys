import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardMenu from "@/components/blogsys/DashboardMenu";
import { ServerComponentProps } from "@/types/common";
import Breadcrumb from "@/components/blogsys/Breadcrumb";
import { getAccount } from "@/actions/accounts";
import AccountForm from "./AccountForm";
import HamburgerMenu from "@/components/blogsys/HamburgerMenu";

export default async function Account(props: ServerComponentProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const params = await props.params;
  const id = params.id as string;
  let errMsg = "";
  let account;
  try {
    account = await getAccount(id);
  } catch (err) {
    console.error(err);
    errMsg = err instanceof Error ? err.message : "Coś poszło nie tak";
  }

  return (
    <main className="flex w-full h-screen">
      <DashboardMenu active="/accounts" />

      <section className="flex-1 h-full flex flex-col">
        <div className="flex gap-2 justify-between items-center">
          <Breadcrumb
            items={[
              { label: "Wpisy", href: "/accounts" },
              { label: account?.login ? "Edycja konta" : "Nowe konto", href: `/accounts/${id}` },
            ]}
          />
          <HamburgerMenu active="/accounts" />
        </div>

        {errMsg.length > 0
          ? <div className="h-40 flex items-center justify-center text-red-500">{errMsg}</div>
          : <AccountForm account={account!} />}
      </section>
    </main>
  );
}
