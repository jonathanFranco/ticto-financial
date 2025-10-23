"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import { transactionSchema, type TransactionFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface TransactionSubmitData {
  id?: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

interface TransactionInitialData {
  id?: string;
  description: string;
  amount: string;
  category: string;
  type: "income" | "expense";
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionSubmitData) => void;
  initialData?: TransactionInitialData;
}

const DEFAULT_FORM_VALUES: Partial<TransactionFormData> = {
  type: "income",
};

const MODAL_MESSAGES = {
  create: {
    title: "Cadastrar Transação",
    description:
      "Preencha os dados abaixo para cadastrar uma nova transação financeira.",
    submitButtonLoading: "Cadastrando...",
    submitButton: "Cadastrar",
  },
  edit: {
    title: "Editar Transação",
    description: "Atualize os dados da transação conforme necessário.",
    submitButtonLoading: "Atualizando...",
    submitButton: "Atualizar",
  },
} as const;

export function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData || DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || DEFAULT_FORM_VALUES);
    }
  }, [isOpen, initialData, reset]);

  const type = watch("type");
  const isEditMode = !!initialData;
  const messages = isEditMode ? MODAL_MESSAGES.edit : MODAL_MESSAGES.create;

  const convertToNumericAmount = (amount: string): number => {
    return Number.parseFloat(amount.replace(",", "."));
  };

  const onSubmitForm = async (data: TransactionFormData) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const transactionData: TransactionSubmitData = {
      id: initialData?.id,
      description: data.description,
      amount: convertToNumericAmount(data.amount),
      category: data.category,
      type: data.type,
    };

    onSubmit(transactionData);
    setIsLoading(false);
    reset();
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const sanitizeAmountInput = (value: string): string => {
    return value.replace(/[^0-9,]/g, "");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeAmountInput(e.target.value);
    setValue("amount", sanitizedValue);
  };

  const renderTypeButton = (
    buttonType: "income" | "expense",
    label: string,
    Icon: React.ComponentType<{ className?: string }>
  ) => {
    const isSelected = type === buttonType;
    const colorClasses =
      buttonType === "income"
        ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
        : "border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
    const hoverClasses =
      buttonType === "income"
        ? "hover:border-green-300"
        : "hover:border-red-300";

    return (
      <button
        type="button"
        onClick={() => setValue("type", buttonType)}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          isSelected ? colorClasses : `border-border ${hoverClasses}`
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{messages.title}</DialogTitle>
          <DialogDescription>{messages.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">{"Descrição"}</Label>
            <Input
              id="description"
              placeholder="Ex: Salário, Aluguel, Compras..."
              {...register("description")}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{"Valor"}</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0,00"
              {...register("amount")}
              onChange={handleAmountChange}
              disabled={isLoading}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{"Tipo"}</Label>
            <div className="grid grid-cols-2 gap-3">
              {renderTypeButton("income", "Entrada", ArrowUpCircle)}
              {renderTypeButton("expense", "Saída", ArrowDownCircle)}
            </div>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{"Categoria"}</Label>
            <Select
              id="category"
              value={watch("category") || ""}
              onValueChange={(e) =>
                setValue("category", e, { shouldValidate: true })
              }
              placeholder="Selecione uma categoria"
              disabled={isLoading}
            >
              {TRANSACTION_CATEGORIES.map((cat) => (
                <Select.Item key={cat} value={cat}>
                  {cat}
                </Select.Item>
              ))}
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary-500 text-primary-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {messages.submitButtonLoading}
                </>
              ) : (
                messages.submitButton
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
