import Image from "next/image";
import Link from "next/link";
import { hygraph } from "@/lib/hygraph";
import { GET_POSTS } from "@/lib/queries";

export const revalidate = 60;

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: {
    url: string;
  };
}

export default async function Home() {
  let posts: Post[] = [];

  try {
    const data = await hygraph.request(GET_POSTS);
    posts = data?.posts ?? [];
  } catch (error) {
    console.error("Hygraph fetch error:", error);
  }

  if (!posts.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-zinc-500">No posts available.</p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1, 6);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-16">
      {/* Featured Post */}
      <section className="grid md:grid-cols-2 gap-10 items-center bg-zinc-50 rounded-2xl p-8 shadow-sm">
        {featuredPost.coverImage?.url && (
          <Image
            src={featuredPost.coverImage.url}
            alt={featuredPost.title}
            width={700}
            height={400}
            priority
            className="w-full h-auto object-cover rounded-xl shadow-md"
          />
        )}

        <div>
          <h2 className="text-3xl font-bold mb-4 text-zinc-900">
            {featuredPost.title}
          </h2>
          <p className="text-zinc-600 mb-6">
            {featuredPost.excerpt}
          </p>
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="inline-block rounded-full bg-zinc-900 px-6 py-2 text-sm text-white font-medium hover:bg-zinc-700 transition"
          >
            Read More →
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="grid md:grid-cols-2 gap-10">
        {latestPosts.map((post) => (
          <article
            key={post.id}
            className="group flex gap-5 items-start p-4 rounded-xl hover:bg-zinc-50 transition"
          >
            {post.coverImage?.url && (
              <div className="relative w-32 h-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage.url}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2 text-lg text-zinc-900 group-hover:text-indigo-600 transition">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm text-zinc-500 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
