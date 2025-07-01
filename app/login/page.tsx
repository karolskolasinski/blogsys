import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { ServerComponentProps } from "@/types/common";

export default async function LoginPage(props: ServerComponentProps) {
  const session = await auth();
  if (session) {
    return redirect("/users");
  }
  const initialized = (await props.searchParams).initialized;

  return (
    <main className="flex-1">
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

        {initialized === "true" && (
          <div className="text-green-600 text-sm">
            Konto administratora zostało utworzone. Możesz się zalogować.
          </div>
        )}

        <button type="submit" className="button mt-4">
          Zaloguj się
        </button>
      </form>
    </main>
  );
}
