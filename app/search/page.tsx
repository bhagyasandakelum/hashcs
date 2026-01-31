
import { hygraph } from "@/lib/hygraph";
import { gql } from "graphql-request";
import Link from "next/link";
import Image from "next/image";

// Revalidate search results every minute
export const revalidate = 60;

const SEARCH_POSTS = gql`
  query SearchPosts($query: String!) {
    posts(
      where: {
        _search: $query
      }
      orderBy: publishedAt_DESC
      first: 20
    ) {
      id
      title
      slug
      excerpt
      publishedAt
      coverImage {
        url
      }
      categories: name {
        ... on Category {
          name
          slug
        }
      }
    }
  }
`;

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string } | Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q || "";

    let posts = [];

    if (query) {
        try {
            const data: any = await hygraph.request(SEARCH_POSTS, { query });
            posts = data.posts || [];
        } catch (error) {
            console.error("Search error:", error);
        }
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-20 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-zinc-900">
                Search Results for <span className="text-indigo-600">"{query}"</span>
            </h1>

            {posts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <div className="relative aspect-[16/9] w-full bg-zinc-100">
                                {post.coverImage?.url ? (
                                    <Image
                                        src={post.coverImage.url}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-zinc-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex gap-2 flex-wrap mb-3">
                                    {post.categories.map((cat: any) => (
                                        <span key={cat.slug} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900 group-hover:text-indigo-600 transition mb-2">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-zinc-500 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-zinc-500 text-lg">No posts found matching your search.</p>
                </div>
            )}
        </main>
    );
}
