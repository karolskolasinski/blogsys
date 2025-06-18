import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type User = {
  id?: string;
  name?: string;
  email?: string;
  fullName?: string;
  model?: string;
  registration?: string;
  location?: string;
  lat?: number;
  lng?: number;
  password?: string;
  role?: string;
  updatedAt?: Date | null;
  isOpen?: boolean;
};

async function Users() {
  const docRef = collection(db, "users");
  const docSnap = await getDocs(docRef);
  const users: User[] = docSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
    };
  });

  // const updateUser = async () => {
  //   const res = await fetch("/api/admin/update-user", {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       uid: "k7OTjah976OqCbwahms2yQJqIYg2",
  //       email: "karolskolasinski@gmail.com",
  //       displayName: "New Name",
  //       role: "admin",
  //     }),
  //   });
  //
  //   const data = await res.json();
  //   console.log(data);
  //
  //   await auth.currentUser?.getIdToken(true);
  // };

  return (
    <section className="flex-1 w-full max-w-7xl mx-auto py-4 px-2">
      <div className="text-gray-500 uppercase font-semibold mx-5 my-3">
        <small>Pojazdy</small>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 rounded-3xl flex flex-col gap-3 border border-transparent hover:border"
          >
            <div className="flex gap-3 items-center">
              <h2 className="text-base font-bold text-black">{user.name}</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                {user.role}
              </span>
            </div>

            {user.location
              ? <span className="text-green-600">{user.location}</span>
              : <span className="text-red-500">Brak ustawionej lokalizacji</span>}

            <div>
              <strong>Aktualizacja:</strong> {user.updatedAt?.toLocaleString()}
            </div>

            <div>
              <strong>Email:</strong> {user.email}
            </div>

            <div>
              <strong>Imię i nazwisko:</strong> {user.fullName}
            </div>

            <div>
              <strong>Model:</strong> {user.model}
            </div>

            <div>
              <strong>Rejestracja:</strong> {user.registration}
            </div>

            <div className="flex gap-3 justify-end mt-10">
              {user.role !== "admin" && (
                <form action={`/api/users/${user.id}`} method="POST">
                  <input type="hidden" name="method" value="DELETE" />
                  <input type="hidden" name="id" value={user.id} />

                  <button className="button !bg-transparent !border-gray-300">
                    Usuń
                  </button>
                </form>
              )}

              <form action={`/dashboard/users/${user.id}`} method="GET">
                <button className="button">Edytuj</button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <form action={`/dashboard/users/new`} method="GET" className="flex justify-end mt-10">
        <button className="button">Dodaj nowy</button>
      </form>
    </section>
  );
}

export default Users;
