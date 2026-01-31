"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchPosts } from "@/app/actions";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch results
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 1) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            setIsOpen(true);
            const posts = await searchPosts(debouncedQuery);
            setResults(posts);
            setIsLoading(false);
        };

        fetchResults();
    }, [debouncedQuery]);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div ref={wrapperRef} className="relative z-50">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    className="w-48 rounded-full border border-zinc-300 bg-zinc-100 pl-4 pr-10 py-2 text-sm text-black placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-black transition-all focus:w-64"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : query ? (
                        <button type="button" onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}>
                            <X size={16} className="hover:text-black" />
                        </button>
                    ) : (
                        <Search size={16} />
                    )}
                </div>
            </form>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden">
                    {results.length > 0 ? (
                        <ul>
                            {results.map((post) => (
                                <li key={post.id} className="border-b border-zinc-100 last:border-0">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="flex gap-4 p-4 hover:bg-zinc-50 transition items-start"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {post.coverImage?.url && (
                                            <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden">
                                                <Image src={post.coverImage.url} alt="" fill className="object-cover" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-sm font-semibold text-zinc-900 line-clamp-1">{post.title}</h4>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                {new Date(post.publishedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={(e) => handleSearch(e)}
                                    className="w-full text-center py-3 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition"
                                >
                                    View all results
                                </button>
                            </li>
                        </ul>
                    ) : (
                        !isLoading && debouncedQuery.length >= 2 && (
                            <div className="p-4 text-center text-sm text-zinc-500">
                                No results found.
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
