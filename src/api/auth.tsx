import http from "./http";

export const apiLogin = (email: string, password: string) =>
  http.post("/auth/login", { email, password });

export const apiRegister = (name: string, email: string, password: string) =>
  http.post("/auth/register", { name, email, password });

export interface UpdateProfilePayload {
  name: string;
  bio?: string;
}
export const apiUpdateProfile = (payload: UpdateProfilePayload) =>
  http.patch("/auth/me/profile", payload);

export const apiGetProfile = () => http.get("/auth/me");