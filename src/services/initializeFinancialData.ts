import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function initializeFinancialData() {
  try {
    // Create initial financial summary
    const summaryRef = collection(db, 'financialSummary');
    await addDoc(summaryRef, {
      totalReceivables: 0,
      totalPayables: 0,
      overdueReceivables: 0,
      overduePayables: 0,
      cashflow: [],
      topDebtors: [],
      topCreditors: [],
      updatedAt: new Date().toISOString()
    });

    console.log('Financial collections initialized successfully');
  } catch (error) {
    console.error('Error initializing financial collections:', error);
    throw error;
  }
}