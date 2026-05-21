import { baseApi } from "../../../shared/api/baseApi";
import type { User } from "../../../entities/user/model/types";

export interface RegisterDto {
  email: string;
  password: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  phone?: string | null;
  userType?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MeResponse {
  user: User;
}

export const registerRequest = async (
  data: RegisterDto
): Promise<AuthResponse> => {
  const response = await baseApi.post("/auth/register", data);
  return response.data;
};

export const loginRequest = async (
  data: LoginDto
): Promise<AuthResponse> => {
  const response = await baseApi.post("/auth/login", data);
  return response.data;
};

export const meRequest = async (): Promise<MeResponse> => {
  const response = await baseApi.get("/auth/me");
  return response.data;
};