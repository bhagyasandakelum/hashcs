"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  "Cybersecurity",
  "Networking",
  "AI/ML",
  "Data Science",
  "Cloud",
  "SDLC",
];

export default function Header() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      // future: route to /search?q=
      console.log("Search:", query);
    }
  };

  const handleSubscribe = () => {
    // future: open modal / email service
    alert("Subscribe feature coming soon 🚀");
  };

  return (
    <header className="border-b border-zinc-800">
      {/* Top Row */}
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-48 rounded-full border border-zinc-950  px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white"
        />

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide hover:opacity-80"
        >
          HASHCS
        </Link>

        {/* Subscribe */}
        <button
          onClick={handleSubscribe}
          className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
        >
          SUBSCRIBE
        </button>
      </div>

      {/* Categories */}
      <nav className="mx-auto max-w-6xl px-6 py-3 flex gap-8 text-sm font-medium justify-center text-zinc-1000">
        {categories.map((cat) => (
          <span
            key={cat}
            className="cursor-pointer hover:underline hover:bold"
          >
            {cat}
          </span>
        ))}
      </nav>
    </header>
  );
}
