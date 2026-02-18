// ──────────────────────────────────────────────────────
// ScreenSlaver Studio — Core Type System
// ──────────────────────────────────────────────────────

// ─── Device Types ────────────────────────────────────

export type DeviceType = 'phone' | 'tablet' | 'monitor' | 'tv';

export type DeviceCategory = 'all' | 'phones' | 'tablets' | 'monitors' | 'hero' | 'favorites';

export interface DeviceState {
    time: string;
    battery: number;          // 0–100
    charging: boolean;
    signal: 0 | 1 | 2 | 3 | 4 | 5;
    carrier: string;
    wifi: boolean;
    wifiStrength: 0 | 1 | 2 | 3;
    currentApp: 'home' | 'lock' | 'call' | 'messages' | 'notification' | 'alarm' | 'idle' | 'custom' | 'keyboard';
    typedText: string;        // Text for keyboard simulation
    wallpaper: string;        // URL or preset key
    skin: string;             // Visual skin identifier
    language: string;
    screenLocked: boolean;    // Controller lock — prevents touch on receiver
}

export interface ScreenUnit {
    id: string;
    name: string;             // e.g., "SAM's Phone"
    type: DeviceType;
    group: string;            // Group name or 'No Group'
    isFavorite: boolean;
    isHero: boolean;
    isOnline: boolean;
    baseState: DeviceState;   // Default/initial state
    currentState: DeviceState;// Live state (controller-modified)
}

// ─── Cue Types ───────────────────────────────────────

export type CueType =
    | 'incoming'      // Incoming call
    | 'outgoing'      // Outgoing call
    | 'text'          // Text message
    | 'notification'  // Generic notification
    | 'alarm'         // Alarm / timer
    | 'home'          // Switch to home screen
    | 'lock'          // Switch to lock screen
    | 'idle';         // Idle / sleep state

export interface CueCallData {
    contactName: string;   // e.g., "Mom"
    phoneNumber: string;   // e.g., "+1 555 3456"
}

export interface CueTextData {
    contactName: string;
    message: string;
    phoneNumber?: string;
}

export interface CueNotificationData {
    appName: string;
    title: string;
    body: string;
    icon?: string;
}

export interface CueAlarmData {
    label: string;
    time: string;
}

export interface Cue {
    id: string;
    name: string;           // e.g., "SOS Sam's Mum"
    type: CueType;
    target: CueTarget;
    data: CueCallData | CueTextData | CueNotificationData | CueAlarmData | null;
    delay: number;          // Delay in ms before execution
    duration: number;       // How long the cue stays active (ms), 0 = indefinite
    order: number;          // Position in the cue stack
    color: string;          // Color tag for DJ grid view
    fired: boolean;         // Whether this cue has been fired
}

export interface CueTarget {
    mode: 'device' | 'group';
    deviceId?: string;
    groupName?: string;
}

// ─── Session Types ───────────────────────────────────

export interface Session {
    id: string;
    code: string;            // 6-char alphanumeric (e.g., "29W95N")
    name: string;            // e.g., "Sc. 1 Ext. Night - School Bleachers"
    hostId: string;
    devices: ScreenUnit[];
    cueStack: Cue[];
    presets: Preset[];
    createdAt: string;       // ISO timestamp
    savedAt?: string;        // Last save timestamp (for resume)
}

// ─── Preset Types ────────────────────────────────────

export interface Preset {
    id: string;
    name: string;            // e.g., "Android Generic", "iOS 17 Dark"
    description: string;
    deviceStates: Array<{
        deviceId: string;
        state: Partial<DeviceState>;
    }>;
    cueStack: string[];      // Cue IDs in order
}

// ─── Quick Tool Types ────────────────────────────────

export type QuickToolType =
    | 'chroma-green'
    | 'chroma-blue'
    | 'gray-18'
    | 'gray-50'
    | 'black'
    | 'white'
    | 'color-chart'
    | 'calibration-grid'
    | 'custom-image';

export interface QuickToolConfig {
    type: QuickToolType;
    label: string;
    color?: string;          // For solid-color tools
    trackingMarkers: boolean;
    fullscreen: boolean;
    screenLocked: boolean;   // Triple-tap lock state
    imageUrl?: string;       // For custom-image type
}

// ─── App State Types ─────────────────────────────────

export type AppMode = 'home' | 'controller' | 'receiver' | 'quick-tools';

export type DashboardView = 'devices' | 'cue-grid';  // DJ groove box = cue-grid

export interface AppState {
    mode: AppMode;
    dashboardView: DashboardView;
    activeDeviceId: string | null;
    editDevicePanelOpen: boolean;
}

// ─── Default Factories ───────────────────────────────

export const createDefaultDeviceState = (): DeviceState => ({
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    battery: 100,
    charging: false,
    signal: 4,
    carrier: 'Carrier',
    wifi: true,
    wifiStrength: 3,
    currentApp: 'lock',
    typedText: '',
    wallpaper: '',
    skin: 'ios',
    language: 'en',
    screenLocked: false,
});

export const createDefaultCue = (overrides?: Partial<Cue>): Cue => ({
    id: crypto.randomUUID(),
    name: 'New Cue',
    type: 'incoming',
    target: { mode: 'device' },
    data: null,
    delay: 0,
    duration: 0,
    order: 0,
    color: '#f97316',
    fired: false,
    ...overrides,
});

export const createDefaultSession = (code: string, name: string): Session => ({
    id: crypto.randomUUID(),
    code,
    name,
    hostId: '',
    devices: [],
    cueStack: [],
    presets: [],
    createdAt: new Date().toISOString(),
});
