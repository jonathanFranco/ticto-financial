import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const transactionSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(100, "Descrição muito longa"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => {
      const num = Number.parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Valor deve ser maior que zero"),
  category: z
    .string()
    .min(1, "Categoria é obrigatória")
    .max(50, "Categoria muito longa"),
  type: z.enum(["income", "expense"], {
    required_error: "Tipo é obrigatório",
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
