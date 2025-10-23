import {
  clearCurrentUser,
  getCurrentUser,
  getUsers,
  saveUser,
  setCurrentUser,
} from "@/lib/storage";
import type { LoginFormData } from "@/lib/validations";
import { User } from "@/models/api.model";
import { apiClient } from "../api/config";

export class AuthService {
  static async login(
    data: LoginFormData
  ): Promise<{ success: boolean; error?: string }> {
    const response = await apiClient.request(
      async () => {
        const users = getUsers();
        const user = users.find(
          (u: User) => u.email === data.email && u.password === data.password
        );

        if (user) {
          setCurrentUser(data.email);
          return { user: { email: user.email } };
        } else throw new Error("Email ou senha incorretos");
      },
      { timeout: 1500, skipAuth: true }
    );

    return {
      success: response.success,
      error: response.error,
    };
  }

  static async register(
    data: LoginFormData
  ): Promise<{ success: boolean; error?: string }> {
    const response = await apiClient.request(
      async () => {
        const users = getUsers();
        const userExists = users.find((u: User) => u.email === data.email);
        if (userExists) throw new Error("Este email já está cadastrado");
        saveUser({ email: data.email, password: data.password });
        setCurrentUser(data.email);
        return { user: { email: data.email } };
      },
      { timeout: 1500, skipAuth: true }
    );

    return {
      success: response.success,
      error: response.error,
    };
  }

  static async logout(): Promise<void> {
    await apiClient.request(
      async () => {
        clearCurrentUser();
        return { message: "Logout successful" };
      },
      { timeout: 1000 }
    );
  }

  static getCurrentUser(): { email: string } | null {
    return getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return getCurrentUser() !== null;
  }
}
