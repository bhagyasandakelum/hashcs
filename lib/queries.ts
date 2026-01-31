import { gql } from "graphql-request";

export const GET_POST_WITH_CATEGORIES = gql`
  query GetPostWithCategories($slug: String!) {
    post(where: { slug: $slug }) {
      title
      publishedAt
      content {
        html
      }
      categories: name {
        ... on Category {
          name
          slug
        }
      }
    }
  }
`;

export const GET_RELEVANT_POSTS = gql`
  query GetRelevantPosts($categorySlugs: [String!], $currentSlug: String!) {
    posts(
      where: {
        slug_not: $currentSlug
        name_some: { Category: { slug_in: $categorySlugs } }
      }
      first: 5
    ) {
      id
      title
      slug
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($slug: String!) {
    category(where: { slug: $slug }) {
      id
      name
    }
    posts(where: { name_some: { Category: { slug: $slug } } }, orderBy: publishedAt_DESC) {
      id
      title
      slug
      publishedAt
      coverImage {
        url
      }
    }
    categories {
      id
      name
      slug
    }
  }
`;

export const GET_POSTS = `
  {
    posts(orderBy: publishedAt_DESC) {
      id
      title
      excerpt
      slug
      coverImage {
        url
      }
    }
  }
`;
