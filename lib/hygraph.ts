import { GraphQLClient } from "graphql-request";

const endpoint = process.env.HYGRAPH_ENDPOINT;
const token = process.env.HYGRAPH_TOKEN;

if (!endpoint || !token) {
  console.warn("Hygraph endpoint or token is missing from environment variables.");
}

export const hygraph = new GraphQLClient(endpoint || "", {
  headers: token ? {
    Authorization: `Bearer ${token}`,
  } : {},
});
