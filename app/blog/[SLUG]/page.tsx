import { hygraph } from "@/lib/hygraph";
import { gql } from "graphql-request";
import { notFound } from "next/navigation";

export const revalidate = 60;

const GET_POST = gql`
  query GetPost($slug: String!) {
    post(where: { slug: $slug }) {
      title
      publishedAt
      content {
        html
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

  if (!slug) {
    notFound();
  }

  let data;

  try {
    data = await hygraph.request(GET_POST, { slug });
  } catch (error) {
    console.error("Hygraph post fetch error:", error);
    notFound();
  }

  if (!data?.post) {
    notFound();
  }

  const { post } = data;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

      <p className="mb-10 text-sm text-gray-500">
        {new Date(post.publishedAt).toDateString()}
      </p>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      />
    </article>
  );
}
