"use client";

import Link from "next/link";
import { useState } from "react";
import SubscribeModal from "./SubscribeModal";
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
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  return (
    <>
      <header className="border-b border-zinc-200 bg-white text-black dark:bg-black dark:text-white dark:border-zinc-800 transition-colors duration-300">
        {/* ===== Top Row ===== */}
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          {/* Search */}
          <SearchBar />

          {/* Logo (Return Home) */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide hover:opacity-80 transition"
          >
            HASHCS
          </Link>

          {/* Subscribe */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSubscribeOpen(true)}
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              SUBSCRIBE
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* ===== Categories ===== */}
        <nav className="mx-auto max-w-6xl px-6 py-3 flex gap-8 text-sm font-medium justify-center text-zinc-600 dark:text-zinc-400">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/topics/${cat.slug}`}
              className="hover:text-black dark:hover:text-white hover:underline underline-offset-4 transition"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* ===== Subscribe Modal ===== */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
      />
    </>
  );
}
