import { ApiResponse, RequestConfig } from "@/models/api.model";

export class ApiError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  async request<T>(
    operation: () => T | Promise<T>,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      if (!config.skipAuth && !this.isAuthenticated()) {
        throw new ApiError("User not authenticated", 401);
      }

      const result = config.timeout
        ? await this.withTimeout(Promise.resolve(operation()), config.timeout)
        : await Promise.resolve(operation());

      return {
        data: result,
        success: true,
      };
    } catch (error) {
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError(
              error instanceof Error ? error.message : "Unknown error"
            );

      return {
        data: null,
        success: false,
        error: apiError.message,
      };
    }
  }

  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new ApiError("Request timeout", 504)), timeoutMs)
    );
    return Promise.race([promise, timeoutPromise]);
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("currentUser") !== null;
  }
}

export const apiClient = new ApiClient();
