import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BaseEntity } from '../types/common';
import { getCurrentTimestamp } from '../lib/timeUtils';

interface MasterDataState {
  entities: Record<string, BaseEntity[]>;
  loading: boolean;
  error: string | null;
  setEntities: (collectionName: string, entities: BaseEntity[]) => void;
  fetchEntities: (collectionName: string) => Promise<void>;
  addEntity: (collectionName: string, entity: Omit<BaseEntity, 'id' | 'createdAt' | 'updatedAt' | 'active'>) => Promise<string>;
  updateEntity: (collectionName: string, id: string, data: Partial<BaseEntity>) => Promise<void>;
  deleteEntity: (collectionName: string, id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMasterDataStore = create<MasterDataState>((set, get) => ({
  entities: {},
  loading: false,
  error: null,

  setEntities: (collectionName, entities) => 
    set(state => ({
      entities: {
        ...state.entities,
        [collectionName]: entities
      }
    })),

  fetchEntities: async (collectionName) => {
    try {
      set({ loading: true, error: null });
      const q = query(
        collection(db, collectionName),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      const entities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BaseEntity[];
      
      set(state => ({
        entities: {
          ...state.entities,
          [collectionName]: entities
        }
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error(`Error fetching ${collectionName}:`, error);
    } finally {
      set({ loading: false });
    }
  },

  addEntity: async (collectionName, entity) => {
    try {
      set({ loading: true, error: null });
      const timestamp = getCurrentTimestamp();
      const docRef = await addDoc(collection(db, collectionName), {
        ...entity,
        active: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      await get().fetchEntities(collectionName);
      return docRef.id;
    } catch (error: any) {
      set({ error: error.message });
      console.error(`Error adding ${collectionName}:`, error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateEntity: async (collectionName, id, data) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: getCurrentTimestamp(),
      });

      await get().fetchEntities(collectionName);
    } catch (error: any) {
      set({ error: error.message });
      console.error(`Error updating ${collectionName}:`, error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEntity: async (collectionName, id) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        active: false,
        updatedAt: getCurrentTimestamp(),
      });
      
      set(state => ({
        entities: {
          ...state.entities,
          [collectionName]: state.entities[collectionName]?.filter(entity => entity.id !== id) || []
        }
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error(`Error deleting ${collectionName}:`, error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));