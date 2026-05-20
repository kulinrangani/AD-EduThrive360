import { apiClient } from "./client.js";

export async function listQuizzes(params = {}) {
  const { data } = await apiClient.get("/quizzes", { params });
  return data.quizzes;
}

export async function createQuiz(payload) {
  const { data } = await apiClient.post("/quizzes", payload);
  return data.quiz;
}

export async function getQuiz(id, { includeTree = false } = {}) {
  const { data } = await apiClient.get(`/quizzes/${id}`, {
    params: includeTree ? { include: "tree" } : {},
  });
  return data.quiz;
}

export async function updateQuiz(id, payload) {
  const { data } = await apiClient.patch(`/quizzes/${id}`, payload);
  return data.quiz;
}

export async function deleteQuiz(id) {
  const { data } = await apiClient.delete(`/quizzes/${id}`);
  return data;
}

export async function createGroup(quizId, payload) {
  const { data } = await apiClient.post(`/quizzes/${quizId}/groups`, payload);
  return data.group;
}

export async function updateGroup(quizId, groupId, payload) {
  const { data } = await apiClient.patch(`/quizzes/${quizId}/groups/${groupId}`, payload);
  return data.group;
}

export async function deleteGroup(quizId, groupId) {
  const { data } = await apiClient.delete(`/quizzes/${quizId}/groups/${groupId}`);
  return data;
}

export async function createQuestion(quizId, groupId, payload) {
  const { data } = await apiClient.post(
    `/quizzes/${quizId}/groups/${groupId}/questions`,
    payload,
  );
  return data.question;
}

export async function updateQuestion(quizId, groupId, questionId, payload) {
  const { data } = await apiClient.patch(
    `/quizzes/${quizId}/groups/${groupId}/questions/${questionId}`,
    payload,
  );
  return data.question;
}

export async function deleteQuestion(quizId, groupId, questionId) {
  const { data } = await apiClient.delete(
    `/quizzes/${quizId}/groups/${groupId}/questions/${questionId}`,
  );
  return data;
}

export async function listQuotes(params = {}) {
  const { data } = await apiClient.get("/quotes", { params });
  return data.quotes;
}

export async function createQuote(payload) {
  const { data } = await apiClient.post("/quotes", payload);
  return data.quote;
}

export async function updateQuote(id, payload) {
  const { data } = await apiClient.patch(`/quotes/${id}`, payload);
  return data.quote;
}

export async function deleteQuote(id) {
  const { data } = await apiClient.delete(`/quotes/${id}`);
  return data;
}
