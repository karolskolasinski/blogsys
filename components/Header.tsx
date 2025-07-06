import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  return (
    <header className="z-10 sticky top-0 bg-slate-50 md:bg-slate-50/70 md:backdrop-blur-xs">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <a href="#" className="flex gap-2 items-center font-bold text-2xl">
            <Image
              src="/logo.svg"
              alt="logo"
              width={0}
              height={0}
              priority
              className="h-12 w-auto"
            />
            site
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="hover:text-primary-500 duration-100 ease-in-out">Home</a>
          <Link href="/services" className="hover:text-primary-500 duration-100 ease-in-out">
            Usługi
          </Link>
          <Link href="/users" className="hover:text-primary-500 duration-100 ease-in-out">
            Users
          </Link>
          <Link href="/login" className="hover:text-primary-500 duration-100 ease-in-out">
            Login
          </Link>
        </nav>

        <nav className="md:hidden">
          <div className="relative flex items-center">
            <input
              id="hamburger"
              type="checkbox"
              className="peer opacity-0 w-0 h-[26px] cursor-pointer"
            />

            <label
              htmlFor="hamburger"
              className="absolute top-0 right-0 w-[26px] h-[26px] z-10 flex items-center justify-center cursor-pointer before:absolute before:w-full before:h-[2px] before:bg-gray-700 before:-translate-y-[8px] before:transition-all after:absolute after:w-full after:h-[2px] after:bg-gray-700 after:translate-y-[8px] after:transition-all peer-checked:rotate-45 peer-checked:before:translate-y-0 peer-checked:before:rotate-0 peer-checked:after:translate-y-0 peer-checked:after:rotate-90 transition-transform duration-300"
            >
            </label>

            <span className="w-[26px] h-[2px] bg-gray-700 peer-checked:rotate-90 transition-transform duration-300">
            </span>

            <ul className="peer-checked:right-0 fixed top-0 -right-full w-full h-full pt-28 bg-gray-50 duration-[.25s] shadow-2xl p-4 flex flex-col text-xl">
              <li className="border-b border-t border-gray-200 py-4">
                <a href="#">Home</a>
              </li>
              <li className="border-b border-gray-200 py-4">
                <a href="#">Usługi</a>
              </li>
              <li className="border-b border-gray-200 py-4">
                <a href="#">Zespół</a>
              </li>
              <li className="border-b border-gray-200 py-4">
                <a href="#">Kontakt</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
