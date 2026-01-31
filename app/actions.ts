"use server";

import { hygraph } from "@/lib/hygraph";
import { gql } from "graphql-request";

const INSTANT_SEARCH_QUERY = gql`
  query InstantSearch($query: String!) {
    posts(
      where: {
        OR: [
          { title_contains: $query }
          { excerpt_contains: $query }
        ]
      }
      orderBy: publishedAt_DESC
      first: 5
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

export async function searchPosts(query: string) {
  if (!query || query.trim().length === 0) return [];

  try {
    const data: any = await hygraph.request(INSTANT_SEARCH_QUERY, { query });
    return data.posts;
  } catch (error) {
    console.error("Instant search error:", error);
    return [];
  }
}
