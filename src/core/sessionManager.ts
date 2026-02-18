import { create } from 'zustand';
import commManager from './commManager';
import { DeviceState, ScreenUnit } from '../types';
import { defaultDeviceState } from '../utils/stateValidator';

interface SessionState {
    sessionCode: string | null;
    deviceId: string | null;
    deviceType: 'phone' | 'tablet' | 'tv' | 'monitor';
    role: 'host' | 'client' | null;
    devices: ScreenUnit[]; // For host to track
    connected: boolean;

    // Actions
    createSession: () => void;
    joinSession: (code: string, name: string) => void;
    leaveSession: () => void;
    setDeviceType: (type: 'phone' | 'tablet' | 'tv' | 'monitor') => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    sessionCode: null,
    deviceId: null,
    deviceType: 'phone', // Default
    role: null,
    devices: [],
    connected: false,

    setDeviceType: (type) => set({ deviceType: type }),

    createSession: () => {
        const socket = commManager.connect();
        socket.emit('create_session');

        socket.on('session_created', (code: string) => {
            set({ sessionCode: code, role: 'host', connected: true });
            console.log('Session created:', code);
        });

        socket.on('device_connected', (deviceId: string) => {
            console.log('Device Connected to Session:', deviceId);
            // In a real app, we'd sync full device list here
        });
    },

    joinSession: (code, name) => {
        const socket = commManager.connect();
        socket.emit('join_session', code);

        socket.on('session_joined', (response: { success: boolean; code?: string; message?: string }) => {
            if (response.success) {
                set({ sessionCode: response.code!, role: 'client', connected: true });
                console.log('Joined session:', response.code);
                // Register device details
                // In V2, we would send the initial handshake with name/type here
            } else {
                console.error('Failed to join:', response.message);
                commManager.disconnect();
            }
        });
    },

    leaveSession: () => {
        commManager.disconnect();
        set({ sessionCode: null, role: null, connected: false, devices: [] });
    }
}));
