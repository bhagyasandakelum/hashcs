import Image from "next/image";
import Link from "next/link";
import { hygraph } from "@/lib/hygraph";
import { GET_POSTS } from "@/lib/queries";

export default async function Home() {
  let posts: any[] = [];

  try {
    const data = await hygraph.request(GET_POSTS);
    posts = data?.posts ?? [];
  } catch (err) {
    console.error("Hygraph error:", err);
  }

  const featuredPost = posts[0];
  const latestPosts = posts.slice(1, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* ===== Header ===== */}
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          {/* Search */}
          <input
            type="text"
            placeholder="Search"
            className="w-48 rounded-full border px-4 py-2 text-sm"
          />

          {/* Logo */}
          <h1 className="text-2xl font-bold tracking-wide">HASHCS</h1>

          {/* Subscribe */}
          <button className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white">
            SUBSCRIBE
          </button>
        </div>

        {/* Categories */}
        <nav className="mx-auto max-w-6xl px-6 py-3 flex gap-8 text-sm font-medium justify-center">
          {[
            "Cybersecurity",
            "Networking",
            "AI/ML",
            "Data Science",
            "Cloud Computing",
          ].map((cat) => (
            <Link key={cat} href="#" className="hover:underline">
              {cat}
            </Link>
          ))}
        </nav>
      </header>

      {/* ===== Main Content ===== */}
      <main className="mx-auto max-w-6xl px-6 py-12 space-y-16">
        {/* Featured Post */}
        {featuredPost && (
          <section className="grid md:grid-cols-2 gap-10 items-center border p-6">
            <div className="border">
              {featuredPost.coverImage?.url && (
                <Image
                  src={featuredPost.coverImage.url}
                  alt={featuredPost.title}
                  width={700}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {featuredPost.excerpt}
              </p>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-block rounded-full border px-4 py-2 text-sm"
              >
                Read More..
              </Link>
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section className="grid md:grid-cols-2 gap-10">
          {latestPosts.map((post) => (
            <article
              key={post.id}
              className="border p-5 flex gap-4"
            >
              {post.coverImage?.url && (
                <Image
                  src={post.coverImage.url}
                  alt={post.title}
                  width={160}
                  height={100}
                  className="object-cover"
                />
              )}

              <div>
                <h3 className="font-semibold">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
