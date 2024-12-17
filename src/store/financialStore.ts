import { create } from 'zustand';
import { financialService } from '../services/financialService';
import { Transaction, PaymentRecord, FinancialSummary } from '../types/financial';

interface FinancialState {
  transactions: Transaction[];
  payments: PaymentRecord[];
  summary: FinancialSummary | null;
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  fetchPayments: (transactionId?: string) => Promise<void>;
  fetchSummary: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<string>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => Promise<string>;
  updatePayment: (id: string, data: Partial<PaymentRecord>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  transactions: [],
  payments: [],
  summary: null,
  loading: false,
  error: null,

  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const transactions = await financialService.fetchTransactions();
      set({ transactions, loading: false });
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchPayments: async (transactionId?: string) => {
    try {
      set({ loading: true, error: null });
      const payments = await financialService.fetchPayments(transactionId);
      set({ payments, loading: false });
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchSummary: async () => {
    try {
      set({ loading: true, error: null });
      const summary = await financialService.fetchFinancialSummary();
      set({ summary, loading: false });
    } catch (error: any) {
      console.error('Error fetching summary:', error);
      set({ error: error.message, loading: false });
    }
  },

  addTransaction: async (transaction) => {
    try {
      set({ loading: true, error: null });
      const id = await financialService.addTransaction(transaction);
      await get().fetchTransactions();
      return id;
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateTransaction: async (id, data) => {
    try {
      set({ loading: true, error: null });
      await financialService.updateTransaction(id, data);
      await get().fetchTransactions();
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteTransaction: async (id) => {
    try {
      set({ loading: true, error: null });
      await financialService.deleteTransaction(id);
      await get().fetchTransactions();
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addPayment: async (payment) => {
    try {
      set({ loading: true, error: null });
      const id = await financialService.addPayment(payment);
      await get().fetchPayments();
      return id;
    } catch (error: any) {
      console.error('Error adding payment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updatePayment: async (id, data) => {
    try {
      set({ loading: true, error: null });
      await financialService.updatePayment(id, data);
      await get().fetchPayments();
    } catch (error: any) {
      console.error('Error updating payment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deletePayment: async (id) => {
    try {
      set({ loading: true, error: null });
      await financialService.deletePayment(id);
      await get().fetchPayments();
    } catch (error: any) {
      console.error('Error deleting payment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));