import { hygraph } from "@/lib/hygraph";
import { GET_POSTS_BY_CATEGORY } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

type Post = {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  coverImage?: {
    url: string;
  };
};

type Topic = {
  id: string;
  slug: string;
  name: string;
  coverImage?: {
    url: string;
  }
};

export default async function TopicPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { category, posts, categories } = await hygraph.request(
    GET_POSTS_BY_CATEGORY,
    { slug }
  );

  if (!category) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl font-bold mb-10 text-center text-zinc-800">
        Topic: <span className="text-indigo-600">{category.name}</span>
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
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
              <h2 className="text-xl font-bold text-zinc-900 group-hover:text-indigo-600 transition mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-500">
                {new Date(post.publishedAt).toDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        {categories.map((topic: Topic) => (
          <Link key={topic.id} href={`/topics/${topic.slug}`}>
            {topic.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
