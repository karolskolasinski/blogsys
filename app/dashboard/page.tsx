import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LogoutButton from "@/components/LogoutButton";
import { authOptions } from "@/auth/auth-config";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const usersSnap = await getCountFromServer(collection(db, "users"));
  const ingredientsSnap = await getCountFromServer(collection(db, "ingredients"));
  const dishesSnap = await getCountFromServer(collection(db, "dishes"));

  const usersCount = usersSnap.data().count;
  const ingredientsCount = ingredientsSnap.data().count;
  const menuCount = dishesSnap.data().count;

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  return (
    <section className="flex-1 w-full max-w-7xl mx-auto py-4 px-2">
      <div className="text-gray-500 uppercase font-semibold mx-5 my-3">
        <small>Dashboard</small>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <LogoutButton />
      </div>
    </section>
  );
}
