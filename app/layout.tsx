import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google"; // Correct import name
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ThemeProvider } from "../components/ThemeProvider";
import { SearchProvider } from "@/context/SearchContext";

const spaceGrotesque = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesque",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesque.variable} antialiased bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}