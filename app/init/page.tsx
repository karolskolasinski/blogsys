import { init } from "@/actions/users";

export default async function InitAdminPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4">
        <form
          action={async (formData) => {
            "use server";
            await init(formData);
          }}
          className="flex-1 flex flex-col w-full lg:w-5/12 gap-4 mx-auto"
        >
          <h1 className="text-3xl font-bold mb-4 mt-16 text-center">
            Tworzenie konta startowego
          </h1>

          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              className="w-full h-10 p-2 mt-2 border border-gray-300 rounded-md"
              type="email"
              name="email"
              maxLength={255}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Hasło</label>
            <input
              className="w-full h-10 p-2 mt-2 border border-gray-300 rounded-md"
              type="password"
              name="password"
              maxLength={255}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Klucz autoryzacyjny</label>
            <input
              className="w-full h-10 p-2 mt-2 border border-gray-300 rounded-md"
              type="password"
              name="key"
              maxLength={255}
              autoComplete="off"
              required
            />
          </div>

          <div className="flex justify-center">
            <button type="submit" className="button mt-4">
              Stwórz konto administratora
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
