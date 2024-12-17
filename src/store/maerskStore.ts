import { create } from 'zustand';
import { getActivePorts, getActiveVessels, getPortSchedules, getVesselSchedules } from '../services/maerskApi';
import { Port, Vessel, PortSchedules, VesselSchedules } from '../types/maersk';

interface MaerskState {
  ports: Port[];
  vessels: Vessel[];
  selectedPortSchedules: PortSchedules | null;
  selectedVesselSchedules: VesselSchedules | null;
  loading: boolean;
  error: string | null;
  fetchPorts: () => Promise<void>;
  fetchVessels: () => Promise<void>;
  fetchPortSchedules: (params: any) => Promise<void>;
  fetchVesselSchedules: (params: any) => Promise<void>;
}

export const useMaerskStore = create<MaerskState>((set) => ({
  ports: [],
  vessels: [],
  selectedPortSchedules: null,
  selectedVesselSchedules: null,
  loading: false,
  error: null,

  fetchPorts: async () => {
    try {
      set({ loading: true, error: null });
      const ports = await getActivePorts();
      set({ ports, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchVessels: async () => {
    try {
      set({ loading: true, error: null });
      const vessels = await getActiveVessels();
      set({ vessels, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPortSchedules: async (params) => {
    try {
      set({ loading: true, error: null });
      const schedules = await getPortSchedules(params);
      set({ selectedPortSchedules: schedules, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchVesselSchedules: async (params) => {
    try {
      set({ loading: true, error: null });
      const schedules = await getVesselSchedules(params);
      set({ selectedVesselSchedules: schedules, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));