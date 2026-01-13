"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import SubscribeModal from "./SubscribeModal";
import { useSearch } from "@/context/SearchContext";

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
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const context = useSearch();
  const { posts = [], loading = false } = context || {};

  // ===== Real-time search logic =====
  const results = useMemo(() => {
    if (!query.trim() || loading) return [];
    return posts.filter(
      (post: { title: string; excerpt?: string; slug: string; id: string }) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, posts, loading]);

  return (
    <>
      <header className="border-b border-zinc-800 bg-white text-black relative">
        {/* ===== Top Row ===== */}
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between relative">
          {/* ===== Search ===== */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-56 rounded-full border border-zinc-700 bg-white px-4 py-2 text-sm text-black placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white"
            />

            {/* ===== Live Search Results ===== */}
            {query && results.length > 0 && (
              <div className="absolute left-0 mt-2 w-80 rounded-lg border border-zinc-800 bg-white shadow-xl z-50">
                {results.slice(0, 5).map((post: { title: string; excerpt?: string; slug: string; id: string }) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    onClick={() => setQuery("")}
                    className="block px-4 py-3 hover:bg-zinc-900 transition"
                  >
                    <p className="text-sm font-medium">
                      {post.title}
                    </p>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {/* No results */}
            {query && !loading && results.length === 0 && (
              <div className="absolute left-0 mt-2 w-80 rounded-lg border border-zinc-800 bg-white px-4 py-3 text-sm text-black z-50">
                No results found
              </div>
            )}
          </div>

          {/* ===== Logo (Return Home) ===== */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide hover:opacity-80 transition"
          >
            HASHCS
          </Link>

          {/* ===== Subscribe ===== */}
          <button
            onClick={() => setIsSubscribeOpen(true)}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            SUBSCRIBE
          </button>
        </div>

        {/* ===== Categories ===== */}
        <nav className="mx-auto max-w-6xl px-6 py-3 flex gap-8 text-sm font-medium justify-center text-zinc-900">
          {categories.map((cat) => (
            <span
              key={cat}
              className="cursor-pointer hover:text-black hover:underline transition"
            >
              {cat}
            </span>
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
