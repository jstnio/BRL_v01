import { create } from 'zustand';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HBLData } from '../types/hbl';

interface HBLState {
  loading: boolean;
  error: string | null;
  addHBL: (data: Omit<HBLData, 'id'>) => Promise<string>;
  updateHBL: (id: string, data: Partial<HBLData>) => Promise<void>;
  getHBL: (id: string) => Promise<HBLData | null>;
}

export const useHBLStore = create<HBLState>((set, get) => ({
  loading: false,
  error: null,

  addHBL: async (data) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'houseBillsOfLading'), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding HBL:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateHBL: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'houseBillsOfLading', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error updating HBL:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getHBL: async (id) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'houseBillsOfLading', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as HBLData;
      }
      return null;
    } catch (error: any) {
      console.error('Error getting HBL:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));