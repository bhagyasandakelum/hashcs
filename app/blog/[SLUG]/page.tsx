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
  query GetBlogPage($slug: String!, $categorySlugs: [String!]) {
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

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  /* ================================
     First fetch only post categories
  ================================ */
  const initial = await hygraph.request(
    gql`
      query GetPostCategories($slug: String!) {
        post(where: { slug: $slug }) {
          categories: name {
            ... on Category {
              slug
            }
          }
        }
      }
    `,
    { slug }
  );

  if (!initial?.post) notFound();

  const categorySlugs = initial.post.categories.map(
    (c: Category) => c.slug
  );

  /* ================================
     Main fetch
  ================================ */
  let data: BlogPageData;

  try {
    data = await hygraph.request(GET_BLOG_PAGE, {
      slug,
      categorySlugs,
    });
  } catch (err) {
    console.error("Blog fetch error:", err);
    notFound();
  }

  if (!data?.post) notFound();

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-3 gap-14">
        {/* =======================
            Main Article
        ======================== */}
        <article className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
            {data.post.title}
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            {new Date(data.post.publishedAt).toDateString()}
          </p>

          {/* Cover Image */}
          {data.post.coverImage?.url && (
            <Image
              src={data.post.coverImage.url}
              alt={data.post.title}
              width={900}
              height={500}
              className="rounded-lg mb-10 object-cover"
            />
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-10">
            {data.post.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/topics/${cat.slug}`}
                className="text-xs bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-zinc-800 dark:text-zinc-300 dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: data.post.content.html,
            }}
          />
        </article>

        {/* =======================
            Sidebar
        ======================== */}
        <aside className="space-y-14">
          {/* Relevant */}
          <section>
            <h3 className="mb-4 text-lg font-bold border-b pb-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
              Relevant Articles
            </h3>

            {data.relevantPosts.length ? (
              <div className="space-y-4">
                {data.relevantPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-4 items-start"
                  >
                    {post.coverImage?.url && (
                      <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={post.coverImage.url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400">
                No related articles found.
              </p>
            )}
          </section>

          {/* Latest */}
          <section>
            <h3 className="mb-4 text-lg font-bold border-b pb-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
              Latest Articles
            </h3>

            <div className="space-y-4">
              {data.latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 items-start"
                >
                  {post.coverImage?.url && (
                    <div className="relative w-24 h-16 shrink-0 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
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
