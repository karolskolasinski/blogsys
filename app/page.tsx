import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function Home() {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold">HELLO WORLD</h1>
      </section>
      <Footer />
    </>
  );
}
