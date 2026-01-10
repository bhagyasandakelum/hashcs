import { hygraph } from "@/lib/hygraph";
import { gql } from "graphql-request";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

interface Post {
  id: string;
  title: string;
  slug: string;
}

interface PostPageData {
  post: {
    title: string;
    publishedAt: string;
    content: {
      html: string;
    };
  };
  posts: Post[];
}

const GET_POST_PAGE = gql`
  query GetPostPage($slug: String!) {
    post(where: { slug: $slug }) {
      title
      publishedAt
      content {
        html
      }
    }

    posts(orderBy: publishedAt_DESC, first: 5) {
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

  let data: PostPageData;

  try {
    data = await hygraph.request(GET_POST_PAGE, { slug });
  } catch {
    notFound();
  }

  if (!data?.post || !data?.posts) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-3 gap-12">
      {/* Main Article */}
      <article className="md:col-span-2">
        <h1 className="text-4xl font-bold mb-4">{data.post.title}</h1>

        <p className="text-sm text-zinc-400 mb-10">
          {new Date(data.post.publishedAt).toDateString()}
        </p>

        <div
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: data.post.content.html }}
        />
      </article>

      {/* Sidebar */}
      <aside className="space-y-10">
        {/* Newest */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Newest Articles</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            {data.posts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="hover:text-white"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Relevant (placeholder logic) */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Relevant Articles</h3>
          <p className="text-sm text-zinc-500">
            Coming soon (tag-based relevance).
          </p>
        </div>
      </aside>
    </main>
  );
}
