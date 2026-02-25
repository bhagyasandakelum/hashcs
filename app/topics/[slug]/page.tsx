import { hygraph } from "@/lib/hygraph";
import { GET_POSTS_BY_CATEGORY } from "@/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { gql } from "graphql-request";

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

export async function generateStaticParams() {
  try {
    const data: any = await hygraph.request(gql`
      {
        categories {
          slug
        }
      }
    `);
    return data.categories.map((cat: { slug: string }) => ({
      slug: cat.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for topics:", error);
    return [];
  }
}

export default async function TopicPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    console.error("No slug provided for topic page");
    notFound();
  }

  let data: any;
  try {
    data = await hygraph.request(
      GET_POSTS_BY_CATEGORY,
      { slug }
    );
  } catch (error) {
    console.error(`Error fetching topic page for slug: "${slug}":`, error);
    notFound();
  }

  const { category, posts, categories } = data;

  if (!category) {
    console.error(`Topic not found for slug: "${slug}"`);
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20 min-h-screen">
      <header className="mb-16 text-center">
        <span className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2 block">
          Topic
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100">
          {category.name}
        </h1>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {posts.map((post: Post) => (
          <article key={post.id} className="group flex flex-col h-full">
            <Link
              href={`/blog/${post.slug}`}
              className="block overflow-hidden rounded-xl mb-4 bg-zinc-100 dark:bg-zinc-800 aspect-[4/3] relative shadow-lg"
            >
              {post.coverImage?.url ? (
                <Image
                  src={post.coverImage.url}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-500 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400 font-medium">
                  No Image
                </div>
              )}
            </Link>

            <div className="flex-1 flex flex-col">
              <h2 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                <span className="font-bold text-black dark:text-white uppercase tracking-wider group-hover:underline">Read Now</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Sub Topics</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((topic: Topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="text-sm bg-zinc-100 px-4 py-2 rounded-full hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
            >
              {topic.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
