import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import localFont from "next/font/local";
import { Open_Sans, Work_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";
import Footer from "@/components/Footer";
import { NextResponse } from "next/server";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const calSans = localFont({
  src: "../public/fonts/CalSans-Regular.woff2",
  variable: "--font-cal-sans",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "site",
  description: "desc",
  icons: {
    icon: "/favicon.svg",
  },
  authors: [{
    name: "Karol Skolasiński",
    url: "https://www.linkedin.com/in/karolskolasinski/",
  }],
  openGraph: {
    title: "site",
    description: "desc",
    url: "https://site.url",
    siteName: "site",
    locale: "pl_PL",
    type: "website",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const adminLogin = process.env.INITIAL_ADMIN_LOGIN;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

  if (!adminLogin || !adminPassword) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", adminLogin));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const a = await addDoc(usersRef, {
      login: adminLogin,
      password: adminPassword,
      role: "admin",
      createdAt: Date.now(),
    });

    console.log("Admin user created: ", a);
  }

  return (
    <html lang="pl" className={`${calSans.variable} ${workSans.variable} ${openSans.className}`}>
      <body className="antialiased bg-slate-50 min-h-[100vh] flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
