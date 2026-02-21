import { create } from 'zustand';
import type { SavedScene, ScreenUnit, Cue } from '../types';

const STORAGE_KEY = 'screenslaver_scenes';

interface SceneManagerState {
    scenes: SavedScene[];

    // Actions
    loadScenesFromStorage: () => void;
    saveScene: (name: string, devices: ScreenUnit[], cueStack: Cue[]) => void;
    deleteScene: (id: string) => void;
    getScene: (id: string) => SavedScene | undefined;
}

const readFromStorage = (): SavedScene[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const writeToStorage = (scenes: SavedScene[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
};

export const useSceneStore = create<SceneManagerState>((set, get) => ({
    scenes: readFromStorage(),

    loadScenesFromStorage: () => {
        set({ scenes: readFromStorage() });
    },

    saveScene: (name, devices, cueStack) => {
        const scene: SavedScene = {
            id: crypto.randomUUID(),
            name,
            devices: JSON.parse(JSON.stringify(devices)), // Deep clone
            cueStack: JSON.parse(JSON.stringify(cueStack)),
            savedAt: new Date().toISOString(),
        };
        const updated = [...get().scenes, scene];
        writeToStorage(updated);
        set({ scenes: updated });
    },

    deleteScene: (id) => {
        const updated = get().scenes.filter(s => s.id !== id);
        writeToStorage(updated);
        set({ scenes: updated });
    },

    getScene: (id) => {
        return get().scenes.find(s => s.id === id);
    },
}));
