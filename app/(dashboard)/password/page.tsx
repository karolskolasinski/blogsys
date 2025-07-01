// import { collection, getCountFromServer } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { authOptions } from "@/auth/auth-config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Password() {
  const session = await getServerSession(authOptions);

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
