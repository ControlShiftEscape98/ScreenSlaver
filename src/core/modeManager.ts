import { create } from 'zustand';
import type { AppMode, DashboardView } from '../types';

interface ModeState {
    mode: AppMode;
    dashboardView: DashboardView;
    setMode: (mode: AppMode) => void;
    setDashboardView: (view: DashboardView) => void;
}

export const useModeStore = create<ModeState>((set) => ({
    mode: 'home',
    dashboardView: 'devices',
    setMode: (mode) => set({ mode }),
    setDashboardView: (view) => set({ dashboardView: view }),
}));
