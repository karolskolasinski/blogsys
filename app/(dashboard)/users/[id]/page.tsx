import UserForm from "@/components/UserForm";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let user;

  if (id !== "new") {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      user = {
        id: docSnap.id,
        ...data,
        updatedAt: data.updatedAt.toDate(),
      };
    } else {
      throw new Error("Nie znaleziono pojazdu o takim id");
    }
  }

  return (
    <section className="flex-1 w-full max-w-7xl mx-auto py-4 px-2">
      <div className="text-gray-500 uppercase font-semibold mx-5 my-3">
        <small>Formularz pojazdu</small>
      </div>

      <UserForm user={user} />
    </section>
  );
}

export default Page;
