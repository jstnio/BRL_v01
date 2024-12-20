import { create } from 'zustand';
import { OceanProduct } from '../types/maersk';

interface MaerskState {
  oceanProducts: OceanProduct[];
  loading: boolean;
  error: string | null;
}

export const useMaerskStore = create<MaerskState>((set) => ({
  oceanProducts: [],
  loading: false,
  error: null,
}));