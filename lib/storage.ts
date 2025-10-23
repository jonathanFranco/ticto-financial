import { Summary, Transaction, User } from "@/models/api.model";

export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const getCurrentUser = (): { email: string } | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (email: string): void => {
  localStorage.setItem("currentUser", JSON.stringify({ email }));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem("currentUser");
};

export const getTransactions = (userEmail: string): Transaction[] => {
  if (typeof window === "undefined") return [];
  const transactions = localStorage.getItem(`transactions_${userEmail}`);
  return transactions ? JSON.parse(transactions) : [];
};

export const saveTransactions = (
  userEmail: string,
  transactions: Transaction[]
): void => {
  localStorage.setItem(
    `transactions_${userEmail}`,
    JSON.stringify(transactions)
  );
};

export const saveTransactionsById = (
  userEmail: string,
  transactions: Record<string, Transaction>
): void => {
  const transactionsArray = Object.values(transactions);
  localStorage.setItem(
    `transactions_${userEmail}`,
    JSON.stringify(transactionsArray)
  );
};

export const addTransaction = (
  userEmail: string,
  transaction: Transaction
): Transaction[] => {
  const transactions = getTransactions(userEmail);
  const newTransactions = [transaction, ...transactions];
  saveTransactions(userEmail, newTransactions);
  return newTransactions;
};

export const deleteTransaction = (
  userEmail: string,
  transactionId: string
): Transaction[] => {
  const transactions = getTransactions(userEmail);
  const newTransactions = transactions.filter((t) => t.id !== transactionId);
  saveTransactions(userEmail, newTransactions);
  return newTransactions;
};

export const calculateSummary = (transactions: Transaction[]): Summary => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return { income, expenses, balance };
};
