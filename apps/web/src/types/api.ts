export type TransactionType = "income" | "expense";

export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: "income" | "expense" | "both";
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  transactionType: TransactionType;
  paymentMethod: string;
  description: string;
  notes?: string;
  date: string;
  currency: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  month: string;
  amount: number;
  currency: string;
  category?: Category | null;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardResponse {
  month: string;
  currency: string;
  summary: {
    totalIncome: number;
    totalExpense: number;
    currentBalance: number;
    savingsAmount: number;
    totalBudget: number;
    remainingBudget: number | null;
  };
  monthlyTrend: Array<{ month: string; income: number; expense: number }>;
  recentTransactions: Transaction[];
}

export interface AnalyticsResponse {
  currency: string;
  year: string;
  expenseDistribution: Array<{ name: string; value: number }>;
  monthlyTrend: Array<{ month: string; income: number; expense: number }>;
  incomeVsExpense: Array<{ type: TransactionType; amount: number }>;
  categoryBreakdown: Array<{ category: string; type: TransactionType; amount: number; count: number }>;
  yearlyReports: Array<{ year: string; income: number; expense: number; balance: number }>;
}

export interface Report {
  id?: string;
  periodType: "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string;
  currency: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  categoryBreakdown: Array<{
    categoryName: string;
    transactionType: TransactionType;
    amount: number;
    count: number;
  }>;
}

export interface NotificationItem {
  id: string;
  type: "budget_warning" | "budget_exceeded" | "savings_reminder" | "system";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger" | "success";
  isRead: boolean;
  createdAt: string;
}

export interface SpendingInsight {
  type:
    | "spending_change"
    | "saving_opportunity"
    | "unusual_expense"
    | "category_optimization"
    | "insufficient_data";
  title: string;
  message: string;
  severity: "info" | "warning" | "danger" | "success";
  metadata?: Record<string, unknown>;
}
