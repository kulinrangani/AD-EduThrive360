import { apiClient } from "./client.js";

export async function listOrgResults(organizationId, params) {
  const { data } = await apiClient.get(`/results/org/${organizationId}`, { params });
  return data.results;
}

export async function getResult(resultId) {
  const { data } = await apiClient.get(`/results/${resultId}`);
  return data.result;
}
