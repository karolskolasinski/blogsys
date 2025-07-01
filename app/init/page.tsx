import { init } from "@/actions/users";

export default async function InitAdminPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4">
        <h1 className="text-3xl font-bold mb-4 mt-16 w-full">Tworzenie konta startowego</h1>

        <form
          action={async (formData) => {
            "use server";
            await init(formData);
          }}
          className="flex flex-col w-full lg:w-1/2 gap-4"
        >
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
              type="email"
              name="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Hasło</label>
            <input
              className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
              type="password"
              name="password"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Klucz autoryzacyjny</label>
            <input
              className="w-full h-10 p-2 mt-2 bg-white border border-gray-300 rounded-md"
              type="password"
              name="key"
              required
            />
          </div>

          <button type="submit" className="button mt-4">
            Stwórz konto administratora
          </button>
        </form>
      </section>
    </main>
  );
}
