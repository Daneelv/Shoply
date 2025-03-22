import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "@/app/assets/styles/globals.css";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Prostore",
  description: "Modern e-commerce for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper"> {children}</main>
      <Footer />
    </div>
  );
}
