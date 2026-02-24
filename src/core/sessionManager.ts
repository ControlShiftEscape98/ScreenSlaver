import { create } from 'zustand';
import commManager from './commManager';
import { DeviceState, ScreenUnit, Cue } from '../types';
import { defaultDeviceState } from '../utils/stateValidator';
import { SyncEngine } from './syncEngine';

interface SessionState {
    sessionId: string | null;
    sessionName: string | null;
    sessionCode: string | null;
    deviceId: string | null;
    deviceType: 'phone' | 'tablet' | 'tv' | 'monitor' | 'laptop' | 'other';
    role: 'host' | 'client' | null;
    devices: ScreenUnit[]; // For host to track connected devices
    cueStack: Cue[];
    connected: boolean;
    syncEnabled: boolean;

    // Client-side state
    myDeviceState: DeviceState | null;

    // Actions
    createSession: () => Promise<void>;
    joinSession: (code: string, name: string) => Promise<void>;
    leaveSession: () => void;
    setDeviceType: (type: 'phone' | 'tablet' | 'tv' | 'monitor' | 'laptop' | 'other') => void;

    // Controller Action to update a device's state
    updateDeviceState: (deviceId: string, updates: Partial<DeviceState>) => void;
    addDevice: (name: string, type: 'phone' | 'tablet' | 'tv' | 'monitor' | 'laptop' | 'other', group?: string) => void;
    removeDevice: (deviceId: string) => void;
    toggleFavorite: (deviceId: string) => void;

    // Cues Actions
    setCueStack: (cues: Cue[]) => void;
    addCue: (cue: Cue) => void;
    updateCue: (cueId: string, updates: Partial<Cue>) => void;
    removeCue: (cueId: string) => void;
    fireCue: (cueId: string) => Promise<void>;

    // DB Actions
    loadSessionFromDb: (sessionId: string) => Promise<boolean>;

    // Realtime Sync
    syncChannel: any | null; // ReturnType<typeof supabase.channel> type is complex to export
    setupSyncSubscription: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
    sessionId: null,
    sessionName: null,
    sessionCode: null,
    deviceId: null,
    deviceType: 'phone',
    role: null,
    devices: [],
    cueStack: [],
    connected: false,
    syncEnabled: false,
    myDeviceState: null,
    syncChannel: null,

    setupSyncSubscription: () => {
        const store = get();
        if (store.syncChannel) {
            SyncEngine.unsubscribe(store.syncChannel);
        }

        if (store.sessionId) {
            const channel = SyncEngine.subscribeToSession(store.sessionId, (update) => {
                if (update.type === 'device') {
                    // Update device from Supabase
                    const payload = update.payload;
                    set((state) => {
                        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                            const dbDevice = payload.new;
                            const existing = state.devices.find(d => d.id === dbDevice.id);

                            const mappedDevice: ScreenUnit = {
                                id: dbDevice.id,
                                name: dbDevice.name,
                                type: dbDevice.type as any,
                                group: dbDevice.group_name || 'No Group',
                                isFavorite: dbDevice.is_favorite,
                                isHero: dbDevice.is_hero,
                                isOnline: dbDevice.is_online,
                                baseState: dbDevice.base_state,
                                currentState: dbDevice.current_state
                            };

                            if (existing) {
                                return {
                                    devices: state.devices.map(d => d.id === dbDevice.id ? mappedDevice : d),
                                    ...(state.deviceId === mappedDevice.id ? { myDeviceState: mappedDevice.currentState } : {})
                                };
                            } else {
                                return {
                                    devices: [...state.devices, mappedDevice],
                                    ...(state.deviceId === mappedDevice.id ? { myDeviceState: mappedDevice.currentState } : {})
                                };
                            }
                        } else if (payload.eventType === 'DELETE') {
                            return { devices: state.devices.filter(d => d.id !== payload.old.id) };
                        }
                        return state;
                    });
                } else if (update.type === 'cue') {
                    // Update cue from Supabase
                    const payload = update.payload;
                    set((state) => {
                        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                            const dbCue = payload.new;
                            const existing = state.cueStack.find(c => c.id === dbCue.id);

                            const mappedCue: Cue = {
                                id: dbCue.id,
                                name: dbCue.name,
                                type: dbCue.type as any,
                                target: dbCue.target as any,
                                data: dbCue.data as any,
                                delay: Number(dbCue.delay),
                                duration: Number(dbCue.duration),
                                order: dbCue.sort_order,
                                color: dbCue.color || '#f97316',
                                fired: dbCue.is_fired
                            };

                            if (existing) {
                                return { cueStack: state.cueStack.map(c => c.id === dbCue.id ? mappedCue : c).sort((a, b) => a.order - b.order) };
                            } else {
                                return { cueStack: [...state.cueStack, mappedCue].sort((a, b) => a.order - b.order) };
                            }
                        } else if (payload.eventType === 'DELETE') {
                            return { cueStack: state.cueStack.filter(c => c.id !== payload.old.id) };
                        }
                        return state;
                    });
                } else if (update.type === 'mode_shift') {
                    // Update global mode from simulation broadcast
                    const { state: newState } = update.payload;
                    set((state) => ({
                        myDeviceState: state.myDeviceState ? { ...state.myDeviceState, ...newState } : null
                    }));
                }
            });
            set({ syncChannel: channel });
            console.log(`[SessionStore] Subscribed to cloud session: ${store.sessionId}`);
        }
    },

    setDeviceType: (type) => set({ deviceType: type }),

    createSession: async () => {
        const sessionId = crypto.randomUUID();
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const sessionName = 'New Project - ' + new Date().toLocaleDateString();

        set({ sessionId, sessionCode: code, sessionName, role: 'host', connected: true });

        // Push to Supabase immediately (assuming user log in)
        const success = await SyncEngine.saveSession({
            id: sessionId,
            code,
            name: sessionName,
            hostId: '', // SyncEngine will pull from auth store internally
            devices: [],
            cueStack: [],
            presets: [],
            createdAt: new Date().toISOString()
        });

        if (success) {
            set({ syncEnabled: true });
            get().setupSyncSubscription();
        }

        // Maintain local fallback broadcast comms setup
        commManager.connect();
        commManager.emit('create_session');

        // HOST is already listening for devices joining via Supabase subscription in setupSyncSubscription()
        // No need for local broadcast listeners for 'device_joined' in a cloud environment

        commManager.on('device_state_updated', (data: { deviceId: string, state: Partial<DeviceState> }) => {
            set((store) => ({
                devices: store.devices.map(d =>
                    d.id === data.deviceId
                        ? { ...d, currentState: { ...d.currentState, ...data.state } }
                        : d
                )
            }));

            // Only update DB if they modify the state, but usually the UI handles local optimistic update first.
            // When the UI calls updateDeviceState is when we sync DB, not on incoming local broadcast, to avoid loop.
        });
    },

    joinSession: async (code, name) => {
        const session = await SyncEngine.getSessionByCode(code);

        if (!session) {
            console.error('Failed to join: Invalid code or no session found');
            return;
        }

        const myId = 'client-' + Math.random().toString(36).substring(2, 9);
        const myDeviceType = get().deviceType;

        const newDevice: ScreenUnit = {
            id: myId,
            name: name,
            type: myDeviceType,
            group: 'No Group',
            isFavorite: false,
            isHero: false,
            isOnline: true,
            baseState: defaultDeviceState,
            currentState: defaultDeviceState
        };

        await SyncEngine.upsertDevice(session.id, newDevice);

        set({
            sessionId: session.id,
            sessionCode: session.code,
            sessionName: session.name,
            devices: session.devices,
            cueStack: session.cueStack,
            role: 'client',
            connected: true,
            deviceId: myId,
            myDeviceState: defaultDeviceState,
            syncEnabled: true
        });

        console.log('[SessionStore] Joined session:', session.code, 'as device:', myId);

        get().setupSyncSubscription();

        // Local fallback broadcast comms setup (optional, but keep for local tab sync if needed)
        commManager.connect();
        // commManager.emit('join_session', { code, name, type: myDeviceType }); // REMOVED: Rely on Supabase upsert

        // CLIENT: Listen for state updates targeting ME from local network
        commManager.on('device_state_updated', (data: { deviceId: string, state: Partial<DeviceState> }) => {
            set((store) => ({
                myDeviceState: store.myDeviceState
                    ? { ...store.myDeviceState, ...data.state }
                    : null
            }));
        });
    },

    leaveSession: () => {
        const store = get();
        if (store.syncChannel) {
            SyncEngine.unsubscribe(store.syncChannel);
        }
        commManager.disconnect();
        set({
            sessionId: null,
            sessionName: null,
            sessionCode: null,
            role: null,
            connected: false,
            devices: [],
            cueStack: [],
            syncEnabled: false,
            myDeviceState: null,
            syncChannel: null,
        });
    },

    updateDeviceState: (deviceId, updates) => {
        // Optimistic update
        set((store) => {
            const nextDevices = store.devices.map(d => {
                if (d.id === deviceId) {
                    const updatedDevice = { ...d, currentState: { ...d.currentState, ...updates } };
                    // Async sync to Supabase
                    if (store.syncEnabled && store.sessionId) {
                        SyncEngine.upsertDevice(store.sessionId, updatedDevice);
                    }
                    return updatedDevice;
                }
                return d;
            });
            return { devices: nextDevices };
        });

        // Broadcast to local network receivers
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

        const store = get();
        if (store.syncEnabled && store.sessionId) {
            SyncEngine.upsertDevice(store.sessionId, newDevice);
        }
    },

    removeDevice: (deviceId) => {
        set((state) => ({ devices: state.devices.filter(d => d.id !== deviceId) }));
        const store = get();
        if (store.syncEnabled && store.sessionId) {
            SyncEngine.removeDevice(deviceId);
        }
    },

    toggleFavorite: (deviceId) => {
        set((store) => {
            const nextDevices = store.devices.map(d => {
                if (d.id === deviceId) {
                    const updatedDevice = { ...d, isFavorite: !d.isFavorite };
                    if (store.syncEnabled && store.sessionId) {
                        SyncEngine.upsertDevice(store.sessionId, updatedDevice);
                    }
                    return updatedDevice;
                }
                return d;
            });
            return { devices: nextDevices };
        });
    },

    // ─── Cues Actions ────────────────────────────────────────────────────────

    setCueStack: (cues) => {
        set({ cueStack: cues });
        const store = get();
        if (store.syncEnabled && store.sessionId) {
            cues.forEach(cue => SyncEngine.upsertCue(store.sessionId!, cue));
        }
    },

    addCue: (cue) => {
        set((state) => ({ cueStack: [...state.cueStack, cue] }));
        const store = get();
        if (store.syncEnabled && store.sessionId) {
            SyncEngine.upsertCue(store.sessionId, cue);
        }
    },

    updateCue: (cueId, updates) => {
        set((state) => {
            const nextCues = state.cueStack.map(c => c.id === cueId ? { ...c, ...updates } : c);
            const store = get();
            if (store.syncEnabled && store.sessionId) {
                const updatedCue = nextCues.find(c => c.id === cueId);
                if (updatedCue) {
                    SyncEngine.upsertCue(store.sessionId, updatedCue);
                }
            }
            return { cueStack: nextCues };
        });
    },

    removeCue: (cueId) => {
        set((state) => ({
            cueStack: state.cueStack.filter(c => c.id !== cueId)
        }));
        const store = get();
        if (store.syncEnabled && store.sessionId) {
            SyncEngine.removeCue(cueId);
        }
    },

    fireCue: async (cueId: string) => {
        const store = get();
        const cue = store.cueStack.find(c => c.id === cueId);
        if (!cue) return;

        console.log(`[SessionStore] Firing cue: ${cue.name} (${cue.type})`);

        // 1. Mark as fired
        set((state) => ({
            cueStack: state.cueStack.map(c => c.id === cueId ? { ...c, fired: true } : c)
        }));

        if (store.syncEnabled && store.sessionId) {
            SyncEngine.upsertCue(store.sessionId, { ...cue, fired: true });
        }

        // 2. Identify target devices
        let targets: ScreenUnit[] = [];
        if (cue.target.mode === 'all') {
            targets = store.devices;
        } else if (cue.target.mode === 'device' && cue.target.deviceId) {
            const d = store.devices.find(dev => dev.id === cue.target.deviceId);
            if (d) targets = [d];
        } else if (cue.target.mode === 'multi-device' && cue.target.deviceIds) {
            targets = store.devices.filter(dev => cue.target.deviceIds?.includes(dev.id));
        } else if (cue.target.mode === 'group' && cue.target.groupName) {
            targets = store.devices.filter(dev => dev.group === cue.target.groupName);
        }

        // 3. Map cue to state updates
        const updates: Partial<DeviceState> = {};

        switch (cue.type) {
            case 'incoming':
            case 'outgoing':
                updates.currentApp = cue.type === 'incoming' ? 'call' : 'call'; // Both use call skin
                if (cue.data?.contactName) {
                    // Update state with contact info if needed
                    // In a more complex app, currentApp: 'call' would look at a 'callState' object
                    // For now, we'll assume the Receiver UI can handle basic cue data
                    // Actually, let's just push the core UI change
                }
                break;
            case 'text':
                updates.currentApp = 'messages';
                if (cue.data?.messageBody) updates.typedText = cue.data.messageBody;
                break;
            case 'home':
                updates.currentApp = 'home';
                break;
            case 'lock':
                updates.currentApp = 'lock';
                break;
            case 'idle':
                updates.currentApp = 'idle';
                break;
            case 'terminal':
                // We don't have a terminal app yet, but we can set it to a future app mode
                // updates.currentApp = 'terminal';
                break;
        }

        // 4. Update all targeted devices
        targets.forEach(device => {
            store.updateDeviceState(device.id, updates);
        });
    },

    // ─── DB Actions ──────────────────────────────────────────────────────────

    loadSessionFromDb: async (sessionId: string) => {
        const session = await SyncEngine.loadSession(sessionId);
        if (session) {
            set({
                sessionId: session.id,
                sessionCode: session.code,
                sessionName: session.name,
                devices: session.devices,
                cueStack: session.cueStack,
                role: 'host',
                connected: true,
                syncEnabled: true
            });
            get().setupSyncSubscription();
            return true;
        }
        return false;
    }
}));
