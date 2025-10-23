import {
  addTransaction,
  calculateSummary,
  deleteTransaction,
  getTransactions,
  saveTransactions,
} from "@/lib/storage";
import type { TransactionFormData } from "@/lib/validations";
import { Summary, Transaction } from "@/models/api.model";
import { apiClient } from "../api/config";
import { AuthService } from "./auth.rest";

export class FinancialService {
  static async getTransactions(userEmail: string): Promise<Transaction[]> {
    const response = await apiClient.request(
      async () => getTransactions(userEmail),
      { timeout: 300 }
    );

    return response.data ?? [];
  }

  static async createTransaction(
    userEmail: string,
    transactionData: TransactionFormData
  ): Promise<Transaction[]> {
    const response = await apiClient.request(
      async () => {
        const transaction: Transaction = {
          id: Date.now().toString(),
          description: transactionData.description,
          amount: Number.parseFloat(transactionData.amount.replace(",", ".")),
          category: transactionData.category,
          type: transactionData.type,
          date: new Date().toISOString(),
        };

        return addTransaction(userEmail, transaction);
      },
      { timeout: 500 }
    );

    return response.data ?? [];
  }

  static async updateTransaction(
    userEmail: string,
    transactionId: string,
    transactionData: TransactionFormData
  ): Promise<Transaction[]> {
    const response = await apiClient.request(
      async () => {
        const transactions = getTransactions(userEmail);
        const updatedTransactions = transactions.map((t) =>
          t.id === transactionId
            ? {
                ...t,
                description: transactionData.description,
                amount: Number.parseFloat(
                  transactionData.amount.replace(",", ".")
                ),
                category: transactionData.category,
                type: transactionData.type,
              }
            : t
        );
        saveTransactions(userEmail, updatedTransactions);
        return updatedTransactions;
      },
      { timeout: 500 }
    );

    return response.data ?? [];
  }

  static async deleteTransaction(
    userEmail: string,
    transactionId: string
  ): Promise<Transaction[]> {
    const response = await apiClient.request(
      async () => deleteTransaction(userEmail, transactionId),
      { timeout: 300 }
    );

    return response.data ?? [];
  }

  static async getSummary(transactions: Transaction[]): Promise<Summary> {
    const response = await apiClient.request(
      async () => calculateSummary(transactions),
      { timeout: 200, skipAuth: true }
    );

    return response.data ?? { income: 0, expenses: 0, balance: 0 };
  }

  static getCurrentUser(): { email: string } | null {
    return AuthService.getCurrentUser();
  }

  static isAuthenticated(): boolean {
    return AuthService.isAuthenticated();
  }
}
