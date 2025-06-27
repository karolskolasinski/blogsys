import { auth, signIn } from "@/auth/auth-config";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    return redirect("/users");
  }

  return (
    <main>
      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", formData);
        }}
        className="flex flex-col w-96 mx-auto mt-44 gap-4"
      >
        <div>
          <label className="block text-sm text-gray-600">Login</label>
          <input
            className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
            name="email"
            type="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Hasło</label>
          <input
            className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
            name="password"
            type="password"
            required
          />
        </div>

        <button type="submit" className="button mt-4">
          Zaloguj się
        </button>

        {/*{error && <p className="text-red-500">{error}</p>}*/}
      </form>
    </main>
  );
}
