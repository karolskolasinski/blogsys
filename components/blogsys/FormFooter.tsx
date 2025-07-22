import Link from "next/link";

type Props = {
  showLoginLink?: boolean;
};

export default function FormFooter(props: Props) {
  const { showLoginLink = true } = props;

  return (
    <>
      <hr className="my-6 border-gray-300" />

      <div className="text-center text-sm flex flex-col gap-4 text-gray-700">
        {showLoginLink && (
          <div>
            Masz już konto?{" "}
            <Link href="/login" className="text-center mt-4 hover:text-black">
              Zaloguj się!
            </Link>
          </div>
        )}

        <Link href="/" className="text-sm hover:text-black w-fit self-center">
          ↩ Wróć na stronę główną
        </Link>
      </div>
    </>
  );
}
