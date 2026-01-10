import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Hashcs - Insights Hub",
  description: "Dedicated to deep dives and clear explanations of core computer science theories, helping readers grasp fundamental concepts with ease and precision.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.variable} font-sans bg-black text-white antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
