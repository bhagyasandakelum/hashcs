import { hygraph } from "@/lib/hygraph";
import { gql } from "graphql-request";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

/* ================================
   Types
================================ */
interface Category {
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage?: {
    url: string;
  };
  publishedAt: string;
}

interface BlogPageData {
  post: {
    title: string;
    publishedAt: string;
    content: {
      html: string;
    };
    coverImage?: {
      url: string;
    };
    categories: Category[];
  };
  relevantPosts: Post[];
  latestPosts: Post[];
}

/* ================================
   GraphQL Query
================================ */
const GET_BLOG_PAGE = gql`
  query GetBlogPage($slug: String!) {
    post(where: { slug: $slug }) {
      title
      publishedAt
      content {
        html
      }
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
    latestPosts: posts(orderBy: publishedAt_DESC, first: 5) {
      id
      title
      slug
      publishedAt
      coverImage {
        url
      }
    }
  }
`;

const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($slug: String!, $categorySlugs: [String!]) {
    relevantPosts: posts(
      where: {
        slug_not: $slug
        name_some: { Category: { slug_in: $categorySlugs } }
      }
      first: 5
      orderBy: publishedAt_DESC
    ) {
      id
      title
      slug
      publishedAt
      coverImage {
        url
      }
    }
  }
`;

export async function generateStaticParams() {
  try {
    const data: any = await hygraph.request(gql`
      {
        posts {
          slug
        }
      }
    `);
    return data.posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    console.error("No slug provided in params");
    notFound();
  }

  /* ================================
     Fetch Main Data
  ================================ */
  let data: any;
  try {
    data = await hygraph.request(GET_BLOG_PAGE, { slug });

    if (!data?.post) {
      console.error(`Post not found in Hygraph for slug: "${slug}"`);
      notFound();
    }
  } catch (err) {
    console.error(`Error fetching blog page for slug: "${slug}":`, err);
    notFound();
  }

  const post = data.post;
  const latestPosts = data.latestPosts;

  /* ================================
     Fetch Related Posts (depends on categories)
  ================================ */
  let relevantPosts: Post[] = [];
  const categorySlugs = post.categories?.map((c: Category) => c.slug) || [];

  if (categorySlugs.length > 0) {
    try {
      const relatedData: any = await hygraph.request(GET_RELATED_POSTS, {
        slug,
        categorySlugs,
      });
      relevantPosts = relatedData.relevantPosts;
    } catch (err) {
      console.error("Error fetching related posts:", err);
      // Don't 404 if only related posts fail
    }
  }

  data = { ...data, post, latestPosts, relevantPosts };

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 pb-20">

      {/* Scroll Progress Bar (Optional - simplified for now as just a top border or similar could be nice, but sticking to requested minimal theme) */}

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20 grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-20">

        {/* =======================
            Main Article Area
        ======================== */}
        <article className="w-full min-w-0">

          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition mb-8 group"
          >
            ← <span className="ml-2 group-hover:underline">Back to Home</span>
          </Link>

          {/* Header */}
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white mb-6 leading-tight">
              {data.post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 justify-center md:justify-start">
              <time dateTime={data.post.publishedAt} className="font-medium">
                {new Date(data.post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="hidden sm:inline">•</span>
              <div className="flex gap-2">
                {post.categories?.map((cat: Category) => (
                  <span key={cat.slug} className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {data.post.coverImage?.url && (
            <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden shadow-lg bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={data.post.coverImage.url}
                alt={data.post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg md:prose-xl max-w-none 
              text-zinc-800 dark:text-zinc-300 
              prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-black dark:prose-strong:text-white
              prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-zinc-100 dark:prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-900 prose-pre:rounded-xl prose-pre:shadow-lg
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-black dark:prose-blockquote:border-white prose-blockquote:pl-6 prose-blockquote:italic
            "
            dangerouslySetInnerHTML={{
              __html: data.post.content.html,
            }}
          />
        </article>

        {/* =======================
            Sidebar
        ======================== */}
        <aside className="space-y-12 lg:sticky lg:top-24 h-fit">
          {/* Relevant Posts */}
          {data.relevantPosts.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                Related Articles
              </h3>
              <div className="flex flex-col gap-6">
                {relevantPosts.map((post: Post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group"
                  >
                    <div className="flex gap-4 items-start">
                      {post.coverImage?.url && (
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                          <Image
                            src={post.coverImage.url}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition duration-500 ease-out"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Latest Posts */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              Latest Reads
            </h3>
            <div className="flex flex-col gap-6">
              {latestPosts.map((post: Post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="flex gap-4 items-start">
                    {/* Optional: Show small images for latest too, or keep text only if preferred. Let's show images for consistency */}
                    {post.coverImage?.url && (
                      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={post.coverImage.url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-500 ease-out"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </aside>

      </div>
    </main>
  );
}
