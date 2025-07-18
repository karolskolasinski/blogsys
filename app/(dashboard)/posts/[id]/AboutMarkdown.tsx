import { useEffect, useRef } from "react";
import InfoIcon from "@/public/icons/info.svg";
import XIcon from "@/public/icons/x.svg";
import Link from "next/link";

export default function AboutMarkdown() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const clickedOutside = e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

      if (clickedOutside) {
        closeDialog();
      }
    };

    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <div
        className="absolute top-[6px] right-[6px] hover:bg-gray-100 rounded-xl p-2 cursor-pointer"
        onClick={openDialog}
        title="Podstawy Markdown"
      >
        <InfoIcon className="w-7 h-7 fill-black cursor-pointer" />
      </div>

      <dialog
        ref={dialogRef}
        className="rounded-xl p-6 max-w-md w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 outline-0 backdrop:backdrop-brightness-90 backdrop:backdrop-blur-[1px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black">Podstawy Markdown</h2>
          <div className="hover:bg-gray-100 rounded-xl p-2 cursor-pointer">
            <XIcon onClick={closeDialog} className="w-6 h-6 fill-gray-700" />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-800">
          <div>
            <h3 className="font-semibold mb-2">Nagłówki:</h3>
            <pre className="bg-gray-100 p-2 rounded"># H1<br/>## H2<br/>### H3</pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Formatowanie tekstu:</h3>
            <pre className="bg-gray-100 p-2 rounded">**pogrubienie**<br/>*kursywa*<br/>~~przekreślenie~~</pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Listy:</h3>
            <pre className="bg-gray-100 p-2 rounded">- punkt 1<br/>- punkt 2<br/>  - podpunkt<br/><br/>1. numerowana lista<br/>2. drugi punkt</pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Linki:</h3>
            <pre className="bg-gray-100 p-2 rounded">[tekst linku](https://example.com)</pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Cytaty:</h3>
            <pre className="bg-gray-100 p-2 rounded">&gt; To jest cytat<br/>&gt; Można pisać w kilku liniach</pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tabele:</h3>
            <pre className="bg-gray-100 p-2 rounded">| Kolumna 1 | Kolumna 2 |<br/>|-----------|-----------|<br/>| Komórka 1 | Komórka 2 |<br/>| Komórka 3 | Komórka 4 |</pre>
          </div>

          <div className="mt-4 pt-2 border-t border-gray-200 text-center">
            <Link
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-gray-700"
            >
              Pełna dokumentacja Markdown
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
