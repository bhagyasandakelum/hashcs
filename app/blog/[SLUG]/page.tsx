import { hygraph } from '@/lib/hygraph';
import { gql } from 'graphql-request';

const GET_POST = gql`
  query GetPost($slug: String!) {
    post(where: { slug: $slug }) {
      title
      content {
        html
      }
      publishedAt
    }
  }
`;

export default async function BlogPost({ params }: any) {
  const { post } = await hygraph.request(GET_POST, {
    slug: params.slug,
  });

  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      />
    </article>
  );
}
