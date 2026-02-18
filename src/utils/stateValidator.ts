import { DeviceState } from '../types';

export const validateDeviceState = (state: Partial<DeviceState>): boolean => {
    if (!state) return false;
    // Basic validation - can be expanded based on rigorous schema checks
    if (typeof state.battery !== 'undefined' && (state.battery < 0 || state.battery > 100)) return false;
    if (typeof state.signal !== 'undefined' && (state.signal < 0 || state.signal > 5)) return false;
    return true;
};

export const defaultDeviceState: DeviceState = {
    time: '12:00',
    battery: 100,
    charging: false,
    signal: 4,
    carrier: 'SLAVER',
    wifi: true,
    currentApp: 'home',
    wallpaper: 'default',
    skin: 'modern-minimal',
    language: 'en',
};
