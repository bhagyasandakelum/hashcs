import { NextResponse } from "next/server";
import { hygraph } from "@/lib/hygraph";
import { gql } from "graphql-request";

const SEARCH_QUERY = gql`
  query SearchPosts {
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

export async function GET() {
  try {
    const data = await hygraph.request(SEARCH_QUERY);
    return NextResponse.json(data.posts);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
