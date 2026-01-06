import { gql } from 'graphql-request';

export const GET_POSTS = gql`
  query GetPosts {
    posts(orderBy: publishedAt_DESC) {
      id
      title
      slug
      excerpt
      publishedAt
      coverImage {
        url
      }
    }
  }
`;
