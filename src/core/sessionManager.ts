import { create } from 'zustand';
import commManager from './commManager';
import { DeviceState, ScreenUnit } from '../types';
import { defaultDeviceState } from '../utils/stateValidator';

interface SessionState {
    sessionCode: string | null;
    deviceId: string | null;
    deviceType: 'phone' | 'tablet' | 'tv' | 'monitor';
    role: 'host' | 'client' | null;
    devices: ScreenUnit[]; // For host to track connected devices
    connected: boolean;

    // Client-side state
    myDeviceState: DeviceState | null;

    // Actions
    createSession: () => void;
    joinSession: (code: string, name: string) => void;
    leaveSession: () => void;
    setDeviceType: (type: 'phone' | 'tablet' | 'tv' | 'monitor') => void;

    // Controller Action to update a device's state
    updateDeviceState: (deviceId: string, updates: Partial<DeviceState>) => void;

    // Add a new device (from the "+ Add Device" button)
    addDevice: (name: string, type: 'phone' | 'tablet' | 'tv' | 'monitor', group?: string) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    sessionCode: null,
    deviceId: null,
    deviceType: 'phone',
    role: null,
    devices: [],
    connected: false,
    myDeviceState: null,

    setDeviceType: (type) => set({ deviceType: type }),

    createSession: () => {
        commManager.connect();
        commManager.emit('create_session');

        commManager.on('session_created', (code: string) => {
            set({ sessionCode: code, role: 'host', connected: true });
            console.log('Session created:', code);
        });

        // HOST: Listen for devices joining via BroadcastChannel
        commManager.on('device_joined', (device: any) => {
            // device: { id, name, type, currentState }
            console.log('Device Joined:', device);
            set((state) => ({
                devices: [...state.devices, {
                    id: device.id,
                    name: device.name,
                    type: device.type,
                    group: 'No Group',
                    isFavorite: false,
                    isHero: false,
                    isOnline: true,
                    baseState: defaultDeviceState,
                    currentState: { ...defaultDeviceState, ...device.currentState }
                }]
            }));
        });

        commManager.on('device_state_updated', (data: { deviceId: string, state: Partial<DeviceState> }) => {
            // HOST: Update local tracking of that device
            set((store) => ({
                devices: store.devices.map(d =>
                    d.id === data.deviceId
                        ? { ...d, currentState: { ...d.currentState, ...data.state } }
                        : d
                )
            }));
        });
    },

    joinSession: (code, name) => {
        commManager.connect();
        commManager.emit('join_session', { code, name, type: get().deviceType });

        commManager.on('session_joined', (response: { success: boolean; code?: string; message?: string }) => {
            if (response.success) {
                // Generate a temporary ID for this client if not provided by server
                const myId = 'client-' + Math.random().toString(36).substr(2, 9);
                set({
                    sessionCode: response.code!,
                    role: 'client',
                    connected: true,
                    deviceId: myId,
                    myDeviceState: defaultDeviceState
                });
                console.log('Joined session:', response.code);
            } else {
                console.error('Failed to join:', response.message);
                commManager.disconnect();
            }
        });

        // CLIENT: Listen for state updates targeting ME
        commManager.on('device_state_updated', (data: { deviceId: string, state: Partial<DeviceState> }) => {
            // In a real app, we check if data.deviceId === currentId.
            // For BroadcastChannel demo, likely the ID won't match perfectly unless we sync it.
            // BUT, since we generated ID locally in 'device_joined' broadcast (in commManager logic?),
            // Wait, commManager doesn't generate ID. 
            // In `simulateBackendResponse` of commManager, I generated `crypto.randomUUID()`.
            // I need to make sure the Client knows its ID.

            // For V1 Demo: Assume ALL updates apply if we are the only client, or handle blindly.
            // Better: update `myDeviceState`.

            set((store) => ({
                myDeviceState: store.myDeviceState
                    ? { ...store.myDeviceState, ...data.state }
                    : null
            }));
        });
    },

    leaveSession: () => {
        commManager.disconnect();
        set({ sessionCode: null, role: null, connected: false, devices: [], myDeviceState: null });
    },

    updateDeviceState: (deviceId, updates) => {
        // Optimistic update (HOST only usually)
        set((store) => ({
            devices: store.devices.map(d =>
                d.id === deviceId
                    ? { ...d, currentState: { ...d.currentState, ...updates } }
                    : d
            )
        }));

        // Broadcast to network
        commManager.emit('update_device_state', { deviceId, state: updates });
    },

    addDevice: (name, type, group) => {
        const newDevice: ScreenUnit = {
            id: crypto.randomUUID(),
            name,
            type,
            group: group || 'No Group',
            isFavorite: false,
            isHero: false,
            isOnline: true,
            baseState: defaultDeviceState,
            currentState: { ...defaultDeviceState },
        };
        set((state) => ({ devices: [...state.devices, newDevice] }));
    },
}));
