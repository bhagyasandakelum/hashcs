import Image from "next/image";
import Link from "next/link";
import { hygraph } from "@/lib/hygraph";
import { GET_POSTS } from "@/lib/queries";

export default async function Home() {
  let posts: any[] = [];

  try {
    const data = await hygraph.request(GET_POSTS);
    posts = data?.posts ?? [];
  } catch (error) {
    console.error("Hygraph error:", error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-4xl px-6 py-20">
        {/* Header */}
        <header className="mb-16 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Hashcs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Writing about cybersecurity, web development, and modern software
            engineering.
          </p>
        </header>

        {/* Empty state */}
        {posts.length === 0 && (
          <p className="text-zinc-500 dark:text-zinc-400">
            No posts published yet.
          </p>
        )}

        {/* Blog posts */}
        <section className="space-y-12">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              {post.coverImage?.url && (
                <div className="mb-5 overflow-hidden rounded-xl">
                  <Image
                    src={post.coverImage.url}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </h2>

              {post.excerpt && (
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
