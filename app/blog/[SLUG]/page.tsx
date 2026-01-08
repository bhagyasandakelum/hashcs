import { hygraph } from "@/lib/hygraph";
import { gql } from "graphql-request";

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

export default async function BlogPost({ params }: any) {
  const { post } = await hygraph.request(GET_POST, {
    slug: params.slug,
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      />
    </article>
  );
}
