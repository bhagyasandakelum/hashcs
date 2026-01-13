"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: { url: string };
}

interface SearchContextType {
  posts: Post[];
  loading: boolean;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/search")
      .then((res) => res.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SearchContext.Provider value={{ posts, loading }}>
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);
