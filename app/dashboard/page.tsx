"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { SummaryCards } from "@/components/summary-cards";
import { TransactionList } from "@/components/transaction-list";
import { TransactionModal } from "@/components/transaction-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import type { TransactionFormData } from "@/lib/validations";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TransactionSubmitData {
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const { logout, checkAuth } = useAuth();

  const {
    transactions,
    summary,
    error,
    isLoading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    retryLastAction,
  } = useTransactions(userEmail);

  useEffect(() => {
    const currentUser = checkAuth();
    if (!currentUser) {
      router.push("/");
      return;
    }

    setUserEmail(currentUser.email);
  }, [router, checkAuth]);

  const convertToFormData = (
    transaction: TransactionSubmitData
  ): TransactionFormData => ({
    description: transaction.description,
    amount: transaction.amount.toString().replace(".", ","),
    category: transaction.category,
    type: transaction.type,
  });

  const handleAddTransaction = async (transaction: TransactionSubmitData) => {
    const formData = convertToFormData(transaction);
    const result = await createTransaction(formData);

    if (result.success) {
      setIsModalOpen(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
  };

  const handleLogout = () => {
    setUserEmail(null);
    logout();
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const renderErrorAlert = () => {
    if (!error) return null;

    return (
      <div className="container mx-auto px-4 pt-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error.message}</span>
            {error.action === "retry" && (
              <Button
                variant="outline"
                size="sm"
                onClick={retryLastAction}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {"Tentar Novamente"}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  const renderLoadingState = () => {
    if (!isLoading) return null;

    return (
      <div className="flex items-center justify-center py-4">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>{"Carregando transações..."}</span>
      </div>
    );
  };

  if (!userEmail) return null;

  return (
    <div className="min-h-screen bg-secondary-500">
      {renderErrorAlert()}

      <DashboardHeader
        onNewTransaction={handleOpenModal}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-6 space-y-6 -mt-20">
        {renderLoadingState()}

        <SummaryCards summary={summary} />

        <TransactionList
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          onUpdate={updateTransaction}
        />
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}
