export type DeviceType = 'phone' | 'tablet' | 'tv' | 'monitor';

export interface DeviceState {
    time: string;
    battery: number;
    charging: boolean;
    signal: 0 | 1 | 2 | 3 | 4 | 5;
    carrier: string;
    wifi: boolean;
    currentApp: 'home' | 'messages' | 'call' | 'custom';
    wallpaper: string;
    skin: string;
    language: string;
}

export interface ScreenUnit {
    id: string;
    name: string;
    type: DeviceType;
    baseState: DeviceState;
    currentState: DeviceState;
    group: string[];
}

export interface CueAction {
    type: 'call' | 'message' | 'battery' | 'video' | 'notification' | 'state_update';
    parameters: Record<string, any>;
    delay: number;
}

export interface Cue {
    id: string;
    name: string;
    color: string;
    targets: string[]; // deviceID or groupName
    actions: CueAction[];
    mode: 'manual';
}

export interface Session {
    code: string;
    hostId: string;
    devices: ScreenUnit[];
    cues: Cue[];
}
