import { ScreenUnit } from '../types';
import { createDefaultDeviceState } from '../types';
import { generateSessionCode } from '../utils/stateValidator';

export const DEMO_SESSION_CODE = generateSessionCode();

export const DEMO_DEVICE: ScreenUnit = {
    id: 'dev-1',
    name: "Hero Phone A", // Generic instead of "Sam's Phone"
    type: 'phone',
    group: 'No Group',
    isFavorite: false,
    isHero: true,
    isOnline: true,
    baseState: createDefaultDeviceState(),
    currentState: createDefaultDeviceState(),
};
