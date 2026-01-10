import { GraphQLClient } from "graphql-request";

const endpoint = process.env.HYGRAPH_ENDPOINT!;
const token = process.env.HYGRAPH_TOKEN!;

export const hygraph = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  fetch: (url, options) =>
    fetch(url, {
      ...options,
      cache: "no-store",
    }),
});
