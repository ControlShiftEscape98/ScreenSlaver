// ──────────────────────────────────────────────────────
// ScreenSlaver Studio — Core Type System
// ──────────────────────────────────────────────────────

// ─── Device Types ────────────────────────────────────

export type DeviceType = 'phone' | 'tablet' | 'monitor' | 'tv' | 'laptop' | 'other';

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
    themeMode: 'light' | 'dark';
    themeColor: string;       // Hex color for OS accents
    skin: string;             // Visual skin identifier
    keyboardColor?: string;   // Custom hex for keyboard
    iconStyle?: 'classic' | 'vibrant' | 'tech' | 'social';
    fontScale?: number;       // 0.8 to 1.2
    language: string;
    screenLocked: boolean;    // Controller lock — prevents touch on receiver
    displayTool: QuickToolType | null;        // Quick tool pushed from controller
    displayToolGrid: GridOverlayType | null;  // Grid overlay on top of display tool
    displayToolMarkers: boolean | null;       // Calibration dots on top of solid screens
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
    | 'idle'          // Idle / sleep state
    | 'loading'       // Suspense loading bar
    | 'terminal'      // Hacker terminal code
    | 'video'         // Video call / surveillance
    | 'error';        // System error overlay

export interface CueData {
    // Phone & Communication
    contactName?: string;
    phoneNumber?: string;
    messageBody?: string;

    // Media & UI overrides
    imageUrl?: string;
    videoUrl?: string;

    // Customization (Base44 style)
    title?: string;
    subtitle?: string;
    colorHex?: string;

    // Loading Bar
    loadingSpeed?: 'slow' | 'normal' | 'fast';
    loadingText?: string;

    // Terminal
    terminalCode?: string;

    // Social & News
    socialPlatform?: 'instagram' | 'twitter' | 'generic';
    socialHandle?: string;

    // Generic
    customJson?: Record<string, any>;
}

export interface Cue {
    id: string;
    name: string;           // e.g., "SOS Sam's Mum"
    type: CueType;
    target: CueTarget;
    data: CueData | null;
    delay: number;          // Delay in ms before execution
    duration: number;       // How long the cue stays active (ms), 0 = indefinite
    order: number;          // Position in the cue stack
    color: string;          // Color tag for DJ grid view
    fired: boolean;         // Whether this cue has been fired
}

export interface CueTarget {
    mode: 'all' | 'device' | 'group' | 'multi-device';
    deviceId?: string;
    deviceIds?: string[];
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
    | 'screen-green'
    | 'screen-blue'
    | 'screen-gray-18'
    | 'screen-gray-50'
    | 'black'
    | 'white'
    | 'color-chart'
    | 'color-chart-chromadumonde'
    | 'color-chart-colorchecker'
    | 'grayscale-wedge'
    | 'smpte-bars'
    | 'custom-image';

export type GridOverlayType =
    | 'thirds'
    | 'golden-ratio'
    | 'golden-spiral'
    | 'crosshair'
    | null;

export interface QuickToolConfig {
    type: QuickToolType;
    label: string;
    color?: string;          // For solid-color tools
    trackingMarkers: boolean;
    fullscreen: boolean;
    screenLocked: boolean;   // Triple-tap lock state
    imageUrl?: string;       // For custom-image type
    gridOverlay?: GridOverlayType;
}

// ─── App State Types ─────────────────────────────────

export type AppMode = 'home' | 'project-gateway' | 'controller' | 'receiver' | 'quick-tools';

export type DashboardView = 'devices' | 'cue-grid';  // DJ groove box = cue-grid

export interface AppState {
    mode: AppMode;
    dashboardView: DashboardView;
    activeDeviceId: string | null;
    editDevicePanelOpen: boolean;
}

// ─── Saved Scene Types ───────────────────────────────

export interface SavedScene {
    id: string;
    name: string;
    devices: ScreenUnit[];
    cueStack: Cue[];
    savedAt: string;         // ISO timestamp
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
    themeMode: 'dark',
    themeColor: '#0ea5e9',    // Default iOS blue/accent
    skin: 'ios',
    keyboardColor: '#aeb3bc', // Default grey 
    iconStyle: 'classic',
    fontScale: 1.0,
    language: 'en',
    screenLocked: false,
    displayTool: null,
    displayToolGrid: null,
    displayToolMarkers: null,
});

export function createDefaultCue(overrides?: Partial<Cue>): Cue {
    return {
        id: crypto.randomUUID(),
        name: 'New Cue',
        type: 'incoming',
        target: { mode: 'all' },
        data: null,
        delay: 0,
        duration: 0,
        color: '#f97316',
        fired: false,
        order: 0,
        ...overrides
    };
}

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
