"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";

/* ================================
   Categories (slug MUST match Hygraph)
================================ */
const categories = [
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Networking", slug: "networking" },
  { name: "AI / ML", slug: "ai-ml" },
  { name: "Data Science", slug: "data-science" },
  { name: "Cloud", slug: "cloud" },
  { name: "SDLC", slug: "sdlc" },
];

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md text-black dark:bg-black/80 dark:text-white dark:border-zinc-800 transition-colors duration-300">
        {/* ===== Top Row ===== */}
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          {/* Logo (Return Home) */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tighter hover:opacity-80 transition"
            >
              HASHCS
            </Link>

            {/* Desktop Nav - Moved here for better UX */}
            <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/topics/${cat.slug}`}
                  className="hover:text-black dark:hover:text-white transition"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            <button
              className="hidden sm:block rounded-full bg-black dark:bg-white px-5 py-2 text-xs font-bold uppercase tracking-wide text-white dark:text-black hover:opacity-80 transition cursor-default"
            >
              Subscribe
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Nav Only */}
        <nav className="md:hidden border-t border-zinc-100 dark:border-zinc-800 px-6 py-3 overflow-x-auto no-scrollbar flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/topics/${cat.slug}`}
              className="whitespace-nowrap hover:text-black dark:hover:text-white transition"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
