import http from "./http";

export const getPrompts = (page = 1, limit = 10) =>
  http.get(`/prompts?page=${page}&limit=${limit}`);
export async function createPrompt(payload: {
  title: string;
  content: string;
}) {
  const { data } = await http.post("/prompts", payload);
  return data; 
}
export const updatePrompt = (
  id: string,
  data: Partial<{ title: string; content: string }>
) => http.patch(`/prompts/${id}`, data);
export const deletePrompt = (id: string) => http.delete(`/prompts/${id}`);
export const upvotePrompt = (id: string) => http.post(`/prompts/${id}/upvote`);

export interface UserStats {
  totalPosts: number;
  totalUpvotes: number;
}
export const getMyStats = () =>
  http.get<{ success: boolean; data: UserStats }>("prompts/me/stats");