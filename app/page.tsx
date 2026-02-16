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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-zinc-500">No posts available.</p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1, 6);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 space-y-20">
      {/* Featured Post */}
      <section className="group relative grid md:grid-cols-2 gap-10 items-center">
        {featuredPost.coverImage?.url && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-lg bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={featuredPost.coverImage.url}
              alt={featuredPost.title}
              fill
              priority
              className="object-cover transition duration-700 ease-out group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase bg-black text-white dark:bg-white dark:text-black rounded-full">
              Featured
            </span>
            {/* Optional: Add date here if desired, keeping it minimal */}
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-zinc-100 leading-tight">
            <Link href={`/blog/${featuredPost.slug}`} className="hover:text-zinc-700 dark:hover:text-zinc-300 transition">
              {featuredPost.title}
            </Link>
          </h2>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed line-clamp-3">
            {featuredPost.excerpt}
          </p>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="inline-flex items-center text-sm font-bold uppercase tracking-wide border-b-2 border-black dark:border-white pb-1 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-600 dark:hover:border-zinc-300 transition w-fit"
          >
            Read Article <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Latest Articles</h3>
          {/* Optional: View All Link */}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {latestPosts.map((post) => (
            <article key={post.id} className="group flex flex-col h-full">
              {post.coverImage?.url && (
                <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-xl mb-4 bg-zinc-100 dark:bg-zinc-800 aspect-[4/3] relative shadow-sm">
                  <Image
                    src={post.coverImage.url}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-500 ease-out group-hover:scale-110"
                  />
                </Link>
              )}

              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 line-clamp-3 text-sm flex-1 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                  <Link href={`/blog/${post.slug}`} className="text-xs font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-100 group-hover:underline">
                    Read Now
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
