import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Open_Sans, Work_Sans } from "next/font/google";

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
  return (
    <html lang="pl" className={`${calSans.variable} ${workSans.variable} ${openSans.className}`}>
      <body className="antialiased min-h-[100vh] flex flex-col">
        {children}
      </body>
    </html>
  );
}
