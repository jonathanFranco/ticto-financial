"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { TransactionFormData } from "@/lib/validations";
import type { Transaction } from "@/models/api.model";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { TransactionModal } from "./transaction-modal";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate?: (
    id: string,
    data: TransactionFormData
  ) => Promise<{ success: boolean }>;
}

const PAGE_SIZE = 5;

const EMPTY_STATE_MESSAGES = {
  title: "Nenhuma transação cadastrada",
  subtitle: 'Clique em "Nova Transação" para começar',
} as const;

const TABLE_HEADERS = [
  { key: "description", label: "Descrição", align: "left" },
  { key: "amount", label: "Valor", align: "left" },
  { key: "category", label: "Categoria", align: "left" },
  { key: "date", label: "Data", align: "left" },
  { key: "actions", label: "Ações", align: "right" },
] as const;

type TableHeaderKey = (typeof TABLE_HEADERS)[number]["key"];

const DELETE_DIALOG_MESSAGES = {
  title: "Confirmar exclusão",
  description:
    "Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.",
  cancel: "Cancelar",
  confirm: "Excluir",
} as const;

export function TransactionList({
  transactions,
  onDelete,
  onUpdate,
}: TransactionListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      paginatedTransactions,
    };
  }, [transactions, currentPage]);

  const handleDeleteClick = (id: string) => setDeleteId(id);

  const handleConfirmDelete = () => {
    if (!deleteId) return;

    onDelete(deleteId);
    setDeleteId(null);

    const newTotalPages = Math.ceil((transactions.length - 1) / PAGE_SIZE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const convertToFormData = (transaction: {
    description: string;
    amount: number;
    category: string;
    type: "income" | "expense";
  }): TransactionFormData => ({
    description: transaction.description,
    amount: transaction.amount.toString().replace(".", ","),
    category: transaction.category,
    type: transaction.type,
  });

  const handleUpdateTransaction = async (transaction: {
    id?: string;
    description: string;
    amount: number;
    category: string;
    type: "income" | "expense";
  }) => {
    if (!transaction.id || !onUpdate) return;

    const formData = convertToFormData(transaction);
    const result = await onUpdate(transaction.id, formData);

    if (result?.success) setIsModalOpen(false);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCancelDelete = () => setDeleteId(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const navigateToPage = (direction: "next" | "previous") => {
    const { totalPages } = paginationData;

    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const renderEmptyState = () => (
    <Card>
      <CardContent className="py-12">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">{EMPTY_STATE_MESSAGES.title}</p>
          <p className="text-sm mt-2">{EMPTY_STATE_MESSAGES.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTransactionAmount = (transaction: Transaction) => (
    <span
      className={
        transaction.type === "income"
          ? "text-green-600 font-medium"
          : "text-red-600 font-medium"
      }
    >
      {transaction.type === "income" ? "+" : "-"}{" "}
      {formatCurrency(transaction.amount)}
    </span>
  );

  const renderEditButton = (transaction: Transaction) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleEditClick(transaction)}
      className="text-primary-500 hover:text-primary-500 hover:bg-primary-500/10 flex items-center gap-1"
    >
      <Pencil className="h-4 w-4" />
    </Button>
  );

  const renderDeleteButton = (transactionId: string) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleDeleteClick(transactionId)}
      className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  const renderTableCell = (
    transaction: Transaction,
    headerKey: TableHeaderKey
  ) => {
    switch (headerKey) {
      case "description":
        return transaction.description;
      case "amount":
        return renderTransactionAmount(transaction);
      case "category":
        return transaction.category;
      case "date":
        return (
          <span className="text-muted-foreground text-sm">
            {formatDate(transaction.date)}
          </span>
        );
      case "actions":
        return (
          <div className="flex gap-2 justify-end">
            {renderEditButton(transaction)}
            {renderDeleteButton(transaction.id)}
          </div>
        );
      default:
        return null;
    }
  };

  const renderDesktopTable = () => {
    const { paginatedTransactions } = paginationData;

    return (
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="bg-secondary-500">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header.key}
                  className={`py-3 px-4 font-medium text-muted-foreground ${
                    header.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction: Transaction) => (
              <tr
                key={transaction.id}
                className="bg-white rounded-xl shadow-sm transition-colors"
                style={{ boxShadow: "0px 1px 4px 0px #0000000A" }}
              >
                {TABLE_HEADERS.map((header, idx) => (
                  <td
                    key={header.key}
                    className={`py-5 px-6 align-middle ${
                      header.align === "right" ? "text-right" : ""
                    } ${idx === 0 ? "rounded-l-xl" : ""} ${
                      idx === TABLE_HEADERS.length - 1 ? "rounded-r-xl" : ""
                    }`}
                  >
                    {renderTableCell(transaction, header.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMobileCards = () => {
    const { paginatedTransactions } = paginationData;

    return (
      <div className="md:hidden space-y-3">
        {paginatedTransactions.map((transaction: Transaction) => (
          <div key={transaction.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{transaction.description}</h3>
                <p className="text-sm text-muted-foreground">
                  {transaction.category}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(transaction)}
                  className="text-primary-500 hover:text-primary-500 hover:bg-primary-500/10 flex items-center gap-1 -mt-2 -mr-2"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(transaction.id)}
                  className="text-red-500 hover:text-red-500 hover:bg-red-500/10 -mr-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              {renderTransactionAmount(transaction)}
              <span className="text-sm text-muted-foreground">
                {formatDate(transaction.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    const { totalPages } = paginationData;

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages} ({transactions.length}{" "}
          transações)
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPage("previous")}
            disabled={currentPage === 1}
            className="gap-1 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            {"Anterior"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPage("next")}
            disabled={currentPage === totalPages}
            className="gap-1 bg-transparent"
          >
            {"Próxima"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDeleteDialog = () => (
    <AlertDialog open={deleteId !== null} onOpenChange={handleCancelDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{DELETE_DIALOG_MESSAGES.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {DELETE_DIALOG_MESSAGES.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelDelete}>
            {DELETE_DIALOG_MESSAGES.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="bg-red-500 text-red-50 hover:bg-red-500/90"
          >
            {DELETE_DIALOG_MESSAGES.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (transactions.length === 0) return renderEmptyState();

  return (
    <>
      <CardContent className="p-0">
        {renderDesktopTable()}
        {renderMobileCards()}
        {renderPagination()}
      </CardContent>
      {renderDeleteDialog()}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleUpdateTransaction}
        initialData={
          editingTransaction
            ? {
                id: editingTransaction.id,
                description: editingTransaction.description,
                amount: editingTransaction.amount.toString().replace(".", ","),
                category: editingTransaction.category,
                type: editingTransaction.type,
              }
            : undefined
        }
      />
    </>
  );
}
