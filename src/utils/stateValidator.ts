import { createDefaultDeviceState } from '../types';

export const defaultDeviceState = createDefaultDeviceState();

/**
 * Generate a 6-character alphanumeric session code
 */
export function generateSessionCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Format a timestamp for display
 */
export function formatTime(date: Date = new Date()): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

/**
 * Generic default device name
 */
export const DEFAULT_DEVICE_NAME = "New Device";
