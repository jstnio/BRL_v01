import { create } from 'zustand';
import { User } from '../types';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    set({ loading: true });
    console.log('AuthStore: Starting initialization');
    
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log('AuthStore: Auth state changed', { firebaseUser: firebaseUser?.uid });
        
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              set({ user: userData, loading: false, initialized: true });
              console.log('AuthStore: User data loaded', { role: userData.role });
            } else {
              console.error('AuthStore: User document not found');
              set({ user: null, loading: false, initialized: true });
            }
          } catch (error) {
            console.error('AuthStore: Error loading user data:', error);
            set({ user: null, loading: false, initialized: true });
          }
        } else {
          console.log('AuthStore: No firebase user');
          set({ user: null, loading: false, initialized: true });
        }
        resolve();
      });

      return () => {
        console.log('AuthStore: Cleanup');
        unsubscribe();
      };
    });
  },

  logout: async () => {
    try {
      await auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
}));