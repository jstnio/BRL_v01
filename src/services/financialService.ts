import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, PaymentRecord, FinancialSummary } from '../types/financial';

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
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transaction,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  }

  async updateTransaction(id: string, data: Partial<Transaction>) {
    const docRef = doc(db, 'transactions', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteTransaction(id: string) {
    const docRef = doc(db, 'transactions', id);
    await updateDoc(docRef, {
      active: false,
      updatedAt: new Date().toISOString()
    });
  }

  async addPayment(payment: Omit<PaymentRecord, 'id'>) {
    const docRef = await addDoc(collection(db, 'payments'), {
      ...payment,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }

  async updatePayment(id: string, data: Partial<PaymentRecord>) {
    const docRef = doc(db, 'payments', id);
    await updateDoc(docRef, data);
  }

  async deletePayment(id: string) {
    await deleteDoc(doc(db, 'payments', id));
  }
}

export const financialService = new FinancialService();