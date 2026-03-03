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

export const dynamic = "force-dynamic";
export const revalidate = 0;


import { headers } from "next/headers";

export default async function TopicPage(props: any) {
  const params = await props.params;
  let rawSlug = params?.slug;

  if (!rawSlug) {
    const headersList = await headers();
    const pathname = headersList.get("x-invoke-path") || headersList.get("x-middleware-invoke") || headersList.get("referer") || "";
    const match = pathname.match(/\/topics\/([^/?]+)/);
    if (match && match[1]) {
      rawSlug = match[1];
    }
  }

  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";

  if (!slug) {
    const headersList = await headers();
    const allHeaders = Object.fromEntries(headersList.entries());
    console.error("No slug provided for topic page", JSON.stringify(props));
    return (
      <div className="p-10 text-red-500 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold">Error: No slug provided in URL</h2>
        <p className="mt-2 text-zinc-600">Please provide the text below to the assistant:</p>
        <pre className="mt-4 bg-zinc-100 p-4 rounded text-black text-xs overflow-auto">
          {JSON.stringify({ props, params, rawSlug, allHeaders }, null, 2)}
        </pre>
      </div>
    );
  }

  // Diagnostic build check
  if (!process.env.HYGRAPH_ENDPOINT) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">Configuration Error</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            HYGRAPH_ENDPOINT environment variable is missing in your Vercel settings.
          </p>
        </div>
      </div>
    );
  }

  let data: any;
  try {
    data = await hygraph.request(
      GET_POSTS_BY_CATEGORY,
      { slug }
    );
  } catch (error: any) {
    console.error(`Error fetching topic page for slug: "${slug}":`, error.message || error);

    if (error.message?.includes("not found") || error.response?.errors?.[0]?.message?.includes("not exist")) {
      notFound();
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">Content Fetch Error</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Failed to connect to the content provider for topics.
          </p>
          <p className="text-xs text-zinc-500 font-mono">{error.message}</p>
        </div>
      </div>
    );
  }

  const { category, posts, categories } = data;

  if (!category) {
    console.error(`Topic not found for slug: "${slug}"`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Debugging "Not Found"</h2>
          <p className="mt-4">We could not find the topic for this slug.</p>
          <pre className="mt-2 text-left bg-zinc-100 dark:bg-zinc-800 p-4 rounded overflow-x-auto text-sm">
            Slug: {slug} {"\n"}
            Response Data keys: {Object.keys(data || {}).join(", ")}
          </pre>
        </div>
      </div>
    );
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
