export interface RequestConfig {
  timeout?: number;
  skipAuth?: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  error?: string;
}

export interface User {
  email: string;
  password: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

export interface Summary {
  income: number;
  expenses: number;
  balance: number;
}
