import { apiClient } from "./client.js";

export async function globalSearch(q) {
  const { data } = await apiClient.get("/search", { params: { q } });
  return data.results;
}
