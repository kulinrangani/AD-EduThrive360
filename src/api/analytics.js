import { apiClient } from "./client.js";

export async function getOverall(params) {
  const { data } = await apiClient.get("/analytics/overall", { params });
  return data;
}

export async function getGroupWise(params) {
  const { data } = await apiClient.get("/analytics/group-wise", { params });
  return data.groups;
}

export async function getHighRiskUsers(params) {
  const { data } = await apiClient.get("/analytics/high-risk-users", { params });
  return data.users;
}
