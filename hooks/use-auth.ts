"use client";

import { useLoading } from "@/contexts/loading-context";
import type { LoginFormData } from "@/lib/validations";
import { AuthService } from "@/services/rest/auth.rest";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const login = useCallback(
    async (
      data: LoginFormData
    ): Promise<{ success: boolean; error?: string }> => {
      startLoading();

      try {
        const result = await AuthService.login(data);
        if (result.success) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          router.push("/dashboard");
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro inesperado",
        };
      } finally {
        stopLoading();
      }
    },
    [router, startLoading, stopLoading]
  );

  const register = useCallback(
    async (
      data: LoginFormData
    ): Promise<{ success: boolean; error?: string }> => {
      startLoading();

      try {
        const result = await AuthService.register(data);
        if (result.success) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          router.push("/dashboard");
        }
        return result;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro inesperado",
        };
      } finally {
        stopLoading();
      }
    },
    [router, startLoading, stopLoading]
  );

  const logout = useCallback(async () => {
    startLoading();

    try {
      await AuthService.logout();
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/");
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      stopLoading();
    }
  }, [router, startLoading, stopLoading]);

  const checkAuth = useCallback(() => {
    return AuthService.getCurrentUser();
  }, []);

  return { login, register, logout, checkAuth };
}
