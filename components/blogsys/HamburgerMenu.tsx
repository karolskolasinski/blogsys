export default function HamburgerMenu() {
  return (
    <nav className="lg:hidden px-4">
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

        <ul className="peer-checked:right-0 fixed top-0 -right-full w-full h-full bg-white duration-[.25s] shadow-2xl p-4 flex flex-col gap-6 text-2xl font-bold items-center">
          <li className="self-start">
            <div className="flex gap-2 items-center">
              {/*<img src="img/logo.svg" alt="logo" className="w-8 xs:w-9" />*/}
              <div className="flex flex-col font-black text-[1.75rem] leading-5 xs:text-[2rem] xs:leading-6">
                LOGO
              </div>
            </div>
          </li>

          <li className="w-full flex justify-center">
            <hr className="w-full border-gray-300" />
          </li>

          <li className="">
            <div>Menu 1</div>
          </li>

          <li className="w-full flex justify-center">
            <hr className="w-full border-gray-300" />
          </li>
          <li className="flex flex-col items-center justify-end w-full">
            <div className="button w-full">Logout</div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
