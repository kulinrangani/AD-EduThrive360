import { apiClient } from "./client.js";

export async function listOrganizations() {
  const { data } = await apiClient.get("/organizations");
  return data.organizations;
}

export async function createOrganization(payload) {
  const { data } = await apiClient.post("/organizations", payload);
  return {
    organization: data.organization,
    admin: data.admin,
  };
}

export async function getOrganization(id) {
  const { data } = await apiClient.get(`/organizations/${id}`);
  return data.organization;
}

export async function addOrganizationMember(orgId, payload) {
  const { data } = await apiClient.post(`/organizations/${orgId}/members`, payload);
  return data.user;
}

export async function updateOrganization(id, payload) {
  const { data } = await apiClient.patch(`/organizations/${id}`, payload);
  return data.organization;
}

export async function listOrganizationMembers(orgId, params = {}) {
  const { data } = await apiClient.get(`/organizations/${orgId}/members`, { params });
  return data.members;
}

export async function updateOrganizationMember(orgId, userId, payload) {
  const { data } = await apiClient.patch(`/organizations/${orgId}/members/${userId}`, payload);
  return data.user;
}

export async function deactivateOrganizationMember(orgId, userId) {
  const { data } = await apiClient.delete(`/organizations/${orgId}/members/${userId}`);
  return data;
}
