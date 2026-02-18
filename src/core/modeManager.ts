import { create } from 'zustand';

type AppMode = 'setup' | 'controller' | 'receiver';

interface ModeState {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
}

export const useModeStore = create<ModeState>((set) => ({
    mode: 'setup',
    setMode: (mode) => set({ mode }),
}));
