import http from "./http";
export const getComments = (promptId: string) =>
  http.get(`/comments/${promptId}`);
export const createComment = (promptId: string, content: string) =>
  http.post(`/comments/${promptId}`, { content });
export const deleteComment = (id: string) => http.delete(`/comments/${id}`);
