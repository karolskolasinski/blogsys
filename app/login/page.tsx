import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { ServerComponentProps } from "@/types/common";
import FormFooter from "@/components/FormFooter";

export default async function LoginPage(props: ServerComponentProps) {
  const session = await auth();
  if (session) {
    return redirect("/posts");
  }
  const initialized = (await props.searchParams).initialized;

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-4">
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
          className="flex-1 w-full max-w-96 mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8 mt-16 text-center">
            Logowanie
          </h1>

          <div className="h-44">
            <label className="block text-sm text-gray-600">Login</label>
            <input
              className="w-full h-10 p-2 mt-2 mb-4 border border-gray-300 rounded-md"
              name="email"
              type="email"
              required
            />

            <label className="block text-sm text-gray-600">Hasło</label>
            <input
              className="w-full h-10 p-2 mt-2 mb-4 border border-gray-300 rounded-md"
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

          <div className="flex justify-center">
            <button type="submit" className="button">
              Zaloguj się
            </button>
          </div>

          <FormFooter showLoginLink={false} />
        </form>
      </section>
    </main>
  );
}
