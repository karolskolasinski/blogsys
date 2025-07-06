import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Password() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <section className="flex-1 w-full max-w-7xl mx-auto py-4 px-2">
      <div className="text-gray-500 uppercase font-semibold mx-5 my-3">
        <small>Zmiana hasła</small>
      </div>
    </section>
  );
}
