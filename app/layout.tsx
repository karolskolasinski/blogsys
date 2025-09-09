import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";

const calSans = localFont({
  src: "../public/fonts/CalSans-Regular.woff2",
  variable: "--font-cal-sans",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
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

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children } = props;

  return (
    <html lang="pl" className={`${calSans.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
