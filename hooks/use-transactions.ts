"use client";

import { toast } from "@/hooks/use-toast";
import type { TransactionFormData } from "@/lib/validations";
import { Summary, Transaction } from "@/models/api.model";
import { FinancialService } from "@/services/rest/transactions.rest";
import { useCallback, useEffect, useState } from "react";

export interface UseTransactionsError {
  message: string;
  code?: string;
  action?: "retry" | "reload";
}

export interface UseTransactionsState {
  transactions: Transaction[];
  summary: Summary;
  error: UseTransactionsError | null;
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
}

export function useTransactions(userEmail: string | null) {
  const [state, setState] = useState<UseTransactionsState>({
    transactions: [],
    summary: { income: 0, expenses: 0, balance: 0 },
    error: null,
    isLoading: false,
    isCreating: false,
    isDeleting: false,
  });

  const handleError = useCallback(
    (error: any, action: string): UseTransactionsError => {
      const errorMessage = error?.message || `Erro ao ${action}`;
      const errorObj: UseTransactionsError = {
        message: errorMessage,
        action: "retry",
      };

      console.error(`Error in ${action}:`, error);

      toast({
        description: errorMessage,
        variant: "destructive",
      });

      return errorObj;
    },
    []
  );

  const loadTransactions = useCallback(async () => {
    if (!userEmail) {
      setState((prev) => ({
        ...prev,
        error: { message: "Usuário não autenticado", action: "reload" },
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await FinancialService.getTransactions(userEmail);
      const summaryData = await FinancialService.getSummary(data);

      setState((prev) => ({
        ...prev,
        transactions: data,
        summary: summaryData,
        error: null,
        isLoading: false,
      }));
    } catch (error) {
      const errorObj = handleError(error, "carregar transações");
      setState((prev) => ({ ...prev, error: errorObj, isLoading: false }));
    }
  }, [userEmail, handleError]);

  const createTransaction = useCallback(
    async (
      data: TransactionFormData
    ): Promise<{ success: boolean; error?: string }> => {
      if (!userEmail) {
        const error = handleError(
          null,
          "criar transação - usuário não autenticado"
        );
        return { success: false, error: error.message };
      }

      setState((prev) => ({ ...prev, isCreating: true, error: null }));

      try {
        const updatedTransactions = await FinancialService.createTransaction(
          userEmail,
          data
        );
        const summaryData = await FinancialService.getSummary(
          updatedTransactions
        );

        setState((prev) => ({
          ...prev,
          transactions: updatedTransactions,
          summary: summaryData,
          error: null,
          isCreating: false,
        }));

        toast({
          description: "Transação criada com sucesso!",
          variant: "success",
        });

        return { success: true };
      } catch (error) {
        const errorObj = handleError(error, "criar transação");
        setState((prev) => ({ ...prev, error: errorObj, isCreating: false }));
        return { success: false, error: errorObj.message };
      }
    },
    [userEmail, handleError]
  );

  const updateTransaction = useCallback(
    async (
      transactionId: string,
      data: TransactionFormData
    ): Promise<{ success: boolean; error?: string }> => {
      if (!userEmail) {
        const error = handleError(
          null,
          "atualizar transação - usuário não autenticado"
        );
        return { success: false, error: error.message };
      }

      const previousTransactions = state.transactions;
      setState((prev) => ({
        ...prev,
        isCreating: true,
        error: null,
      }));

      try {
        const updatedTransactions = await FinancialService.updateTransaction(
          userEmail,
          transactionId,
          data
        );
        const summaryData = await FinancialService.getSummary(
          updatedTransactions
        );

        setState((prev) => ({
          ...prev,
          transactions: updatedTransactions,
          summary: summaryData,
          error: null,
          isCreating: false,
        }));

        toast({
          description: "Transação atualizada com sucesso!",
          variant: "success",
        });

        return { success: true };
      } catch (error) {
        const errorObj = handleError(error, "atualizar transação");
        setState((prev) => ({
          ...prev,
          transactions: previousTransactions,
          error: errorObj,
          isCreating: false,
        }));
        return { success: false, error: errorObj.message };
      }
    },
    [userEmail, handleError, state.transactions]
  );

  const deleteTransaction = useCallback(
    async (
      transactionId: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!userEmail) {
        const error = handleError(
          null,
          "deletar transação - usuário não autenticado"
        );
        return { success: false, error: error.message };
      }

      const previousTransactions = state.transactions;
      setState((prev) => ({
        ...prev,
        isDeleting: true,
        error: null,
        transactions: prev.transactions.filter((t) => t.id !== transactionId),
      }));

      try {
        const updatedTransactions = await FinancialService.deleteTransaction(
          userEmail,
          transactionId
        );
        const summaryData = await FinancialService.getSummary(
          updatedTransactions
        );

        setState((prev) => ({
          ...prev,
          transactions: updatedTransactions,
          summary: summaryData,
          error: null,
          isDeleting: false,
        }));

        toast({
          description: "Transação excluída com sucesso!",
          variant: "success",
        });

        return { success: true };
      } catch (error) {
        const errorObj = handleError(error, "deletar transação");
        setState((prev) => ({
          ...prev,
          transactions: previousTransactions,
          error: errorObj,
          isDeleting: false,
        }));
        return { success: false, error: errorObj.message };
      }
    },
    [userEmail, handleError, state.transactions]
  );

  const retryLastAction = useCallback(() => {
    if (state.error?.action === "retry") {
      setState((prev) => ({ ...prev, error: null }));
      loadTransactions();
    }
  }, [state.error, loadTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    ...state,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: loadTransactions,
    retryLastAction,
  };
}
