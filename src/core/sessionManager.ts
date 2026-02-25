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
    resetAllDevices: () => void;

    // Realtime Sync
    syncChannel: any | null; // ReturnType<typeof supabase.channel> type is complex to export
    setupSyncSubscription: () => void;
    lastErrors: { message: string, timestamp: number, type: string }[];
    reportError: (message: string, type?: string) => void;
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
    lastErrors: [],

    reportError: (message: string, type: string = 'general') => {
        console.error(`[SessionStore] ERROR [${type}]: ${message}`);
        set(state => ({
            lastErrors: [{ message, type, timestamp: Date.now() }, ...state.lastErrors].slice(0, 5)
        }));
    },

    setupSyncSubscription: () => {
        const store = get();
        if (store.syncChannel) {
            SyncEngine.unsubscribe(store.syncChannel);
        }

        if (store.sessionId) {
            // 1. Initial Fetch to recover state
            SyncEngine.getSessionByCode(store.sessionCode || '').then(session => {
                if (session) {
                    set({
                        devices: session.devices,
                        cueStack: session.cueStack
                    });
                    console.log(`[SessionStore] Recovered state for session ${store.sessionCode}: ${session.devices.length} devices, ${session.cueStack.length} cues.`);
                }
            }).catch(err => {
                get().reportError(`Failed to fetch initial session state: ${err.message}`, 'Supabase');
            });

            // 2. Start Realtime Subscription
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
        } else {
            get().reportError('Failed to save session to cloud. Check RLS policies.', 'Supabase');
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
        try {
            const session = await SyncEngine.getSessionByCode(code);
            console.log('[SessionStore] Attempting to join session:', code, 'Fetched Session:', session);

            if (!session) {
                console.error('[SessionStore] Join failed: Invalid code or session not found');
                throw new Error('Invalid Session Code');
            }

            const myId = crypto.randomUUID();
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

            console.log('[SessionStore] Registering device with Supabase...', newDevice);
            const success = await SyncEngine.upsertDevice(session.id, newDevice);
            console.log('[SessionStore] Device registration result:', success);

            if (!success) {
                console.error('[SessionStore] Failed to register device. Check RLS policies or connectivity.');
                throw new Error('Cloud Registration Failed');
            }

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

            // CLIENT: Listen for state updates targeting ME from local network
            commManager.on('device_state_updated', (data: { deviceId: string, state: Partial<DeviceState> }) => {
                if (data.deviceId === myId) {
                    set((store) => ({
                        myDeviceState: store.myDeviceState
                            ? { ...store.myDeviceState, ...data.state }
                            : null
                    }));
                }
            });
        } catch (error: any) {
            console.error('[SessionStore] Join error:', error);
            throw error; // Propagate to UI
        }
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

    resetAllDevices: () => {
        const store = get();
        console.log(`[SessionStore] Resetting all ${store.devices.length} devices to Home...`);
        store.devices.forEach(device => {
            get().updateDeviceState(device.id, {
                currentApp: 'home',
                mode: 'home' as any,
                screenLocked: false,
                displayTool: null,
                identifying: false
            });
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
            isVirtual: true,
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
        const store = get();
        const device = store.devices.find(d => d.id === deviceId);

        if (device?.isOnline && !device?.isHero && !device?.isVirtual) {
            get().reportError(`Cannot delete online device: ${device.name}. Disconnect it first or use force-remove.`, 'Security');
            return;
        }

        set((state) => ({ devices: state.devices.filter(d => d.id !== deviceId) }));
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

    fireCue: async (cueId) => {
        const store = get();
        const cue = store.cueStack.find(c => c.id === cueId);
        if (!cue || !store.sessionId) return;

        console.log(`[SessionStore] Firing cue: ${cue.name} (${cue.type})`);

        // MARK CUE AS FIRED
        set(state => ({
            cueStack: state.cueStack.map(c => c.id === cueId ? { ...c, fired: true } : c)
        }));

        if (store.syncEnabled) {
            SyncEngine.upsertCue(store.sessionId, { ...cue, fired: true });
        }


        // --- TARGETING LOGIC ---
        let targetDevices: ScreenUnit[] = [];
        const { mode, deviceId, deviceIds, groupName } = cue.target;

        if (mode === 'all') {
            targetDevices = store.devices;
        } else if (mode === 'device' && deviceId) {
            const dev = store.devices.find(d => d.id === deviceId);
            if (dev) targetDevices = [dev];
        } else if (mode === 'multi-device' && deviceIds) {
            targetDevices = store.devices.filter(d => deviceIds.includes(d.id));
        } else if (mode === 'group' && groupName) {
            targetDevices = store.devices.filter(d => d.group === groupName);
        }

        // --- MAPPING LOGIC ---
        const updates: Partial<DeviceState> = {};
        switch (cue.type) {
            case 'incoming':
                updates.mode = 'incoming';
                updates.currentApp = 'call';
                updates.contactName = cue.data?.contactName || 'Unknown';
                updates.phoneNumber = cue.data?.phoneNumber || '';
                updates.screenLocked = false;
                break;
            case 'text':
                updates.mode = 'text';
                updates.currentApp = 'messages';
                updates.contactName = cue.data?.contactName || 'Unknown';
                updates.messageBody = cue.data?.messageBody || '';
                break;
            case 'loading':
                updates.mode = 'loading';
                updates.currentApp = 'loading';
                updates.statusText = cue.data?.loadingText || 'Loading...';
                break;
            case 'terminal':
                updates.mode = 'terminal';
                updates.currentApp = 'terminal';
                updates.statusText = cue.data?.terminalCode || '// system initializing...';
                break;
            case 'error':
                updates.mode = 'error';
                updates.currentApp = 'error';
                updates.statusText = cue.data?.title || cue.data?.subtitle || 'System Error';
                break;
            case 'home':
                updates.mode = 'home';
                updates.currentApp = 'home';
                updates.screenLocked = false;
                break;
            case 'lock':
                updates.mode = 'lock';
                updates.currentApp = 'lock';
                updates.screenLocked = true;
                break;
            default:
                updates.mode = cue.type as any;
                updates.currentApp = cue.type as any;
        }

        // --- APPLY UPDATES ---
        targetDevices.forEach(device => {
            store.updateDeviceState(device.id, updates);
        });
    },

    // ─── DB Actions ──────────────────────────────────────────────────────────

    loadSessionFromDb: async (sessionId: string) => {
        try {
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
        } catch (error: any) {
            get().reportError(`Failed to load session: ${error.message}`, 'Supabase');
            return false;
        }
    }
}));
