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
    }

    latestPosts: posts(orderBy: publishedAt_DESC, first: 5) {
      id
      title
      slug
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
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-3 gap-14">
        {/* =======================
            Main Article
        ======================== */}
        <article className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900">
            {data.post.title}
          </h1>

          <p className="text-sm text-zinc-500 mb-6">
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
                className="text-xs bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full hover:bg-zinc-200 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-zinc-800"
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
            <h3 className="mb-4 text-lg font-semibold">
              Relevant Articles
            </h3>

            {data.relevantPosts.length ? (
              <ul className="space-y-3 text-sm text-zinc-500">
                {data.relevantPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-black hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400">
                No related articles found.
              </p>
            )}
          </section>

          {/* Latest */}
          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Latest Articles
            </h3>

            <ul className="space-y-3 text-sm text-zinc-500">
              {data.latestPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-black hover:underline"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
