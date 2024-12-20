import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, PaymentRecord, FinancialSummary } from '../types/financial';
import { getCurrentTimestamp } from '../lib/timeUtils';

class FinancialService {
  async fetchTransactions() {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('active', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[];
  }

  async fetchPayments(transactionId?: string) {
    const paymentsRef = collection(db, 'payments');
    const q = transactionId 
      ? query(paymentsRef, where('transactionId', '==', transactionId))
      : query(paymentsRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PaymentRecord[];
  }

  async fetchFinancialSummary(): Promise<FinancialSummary | null> {
    const summaryRef = collection(db, 'financialSummary');
    const snapshot = await getDocs(summaryRef);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as FinancialSummary;
    }
    return null;
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>) {
    try {
      const timestamp = getCurrentTimestamp();
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transaction,
        active: true,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      return docRef.id;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw new Error('Failed to add transaction. Please try again.');
    }
  }

  async updateTransaction(id: string, data: Partial<Transaction>) {
    try {
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: getCurrentTimestamp()
      });
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw new Error('Failed to update transaction. Please try again.');
    }
  }

  async deleteTransaction(id: string) {
    try {
      const docRef = doc(db, 'transactions', id);
      await updateDoc(docRef, {
        active: false,
        updatedAt: getCurrentTimestamp()
      });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw new Error('Failed to delete transaction. Please try again.');
    }
  }

  async addPayment(payment: Omit<PaymentRecord, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'payments'), {
        ...payment,
        createdAt: getCurrentTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Failed to add payment:', error);
      throw new Error('Failed to add payment. Please try again.');
    }
  }

  async updatePayment(id: string, data: Partial<PaymentRecord>) {
    try {
      const docRef = doc(db, 'payments', id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Failed to update payment:', error);
      throw new Error('Failed to update payment. Please try again.');
    }
  }

  async deletePayment(id: string) {
    try {
      await deleteDoc(doc(db, 'payments', id));
    } catch (error) {
      console.error('Failed to delete payment:', error);
      throw new Error('Failed to delete payment. Please try again.');
    }
  }
}

export const financialService = new FinancialService();