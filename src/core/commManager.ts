import { Socket } from 'socket.io-client';

class CommManager {
    private static instance: CommManager;
    private socket: Socket | null = null;
    private channel: BroadcastChannel | null = null;
    private listeners: Record<string, ((...args: any[]) => void)[]> = {};

    private constructor() {
        // Initialize BroadcastChannel for local dev without backend
        this.channel = new BroadcastChannel('screen_slaver_comms');
        this.channel.onmessage = (event) => {
            const { type, data } = event.data;
            this.notifyListeners(type, data);
        };
    }

    public static getInstance(): CommManager {
        if (!CommManager.instance) {
            CommManager.instance = new CommManager();
        }
        return CommManager.instance;
    }

    public connect(): Socket {
        // Return mock socket or real one if backend exists
        // For V1 local dev, we rely on BroadcastChannel

        // Simulate "connect" event locally
        setTimeout(() => {
            this.notifyListeners('connect', null);
        }, 100);

        return this.socket as any; // Mock return
    }

    public disconnect(): void {
        // this.channel?.close(); // Keep channel open for reload
    }

    public emit(event: string, data?: any): void {
        console.log(`[Comm] Emitting: ${event}`, data);

        // 1. Broadcast to other tabs/windows
        this.channel?.postMessage({ type: event, data });

        // 2. Loopback to self (for testing on single screen)
        // this.notifyListeners(event, data); 
        // Note: Usually we don't loopback emitted events to avoid double-processing,
        // but for "session_created" we might need to handle response.

        // Simulating Backend Responses for specific events
        this.simulateBackendResponse(event, data);
    }

    public on(event: string, callback: (...args: any[]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    public off(event: string, callback?: (...args: any[]) => void): void {
        if (!callback) {
            delete this.listeners[event];
        } else if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    private notifyListeners(event: string, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    // --- Backend Simulation Logic ---
    private simulateBackendResponse(event: string, data: any) {
        // Simulate Server Logic
        if (event === 'create_session') {
            // Echo the session code back to signal success
            // In a real backend, this would be generated or retrieved.
            // For local simulation, we'll just allow the host's logic to proceed.
            setTimeout(() => {
                this.notifyListeners('session_created', data?.code || 'DEMO-CODE');
            }, 500);
        }

        if (event === 'join_session') {
            const { code, name, type } = data;
            setTimeout(() => {
                // In local simulation, we accept any code that is exactly 6 chars
                if (code && code.length === 6) {
                    this.notifyListeners('session_joined', { success: true, code });
                    // Also broadcast to host that a device joined
                    this.channel?.postMessage({
                        type: 'device_joined',
                        data: { id: crypto.randomUUID(), name, type, currentState: {} }
                    });
                } else {
                    this.notifyListeners('session_joined', { success: false, message: 'Invalid Code (Must be 6 characters)' });
                }
            }, 500);
        }

        if (event === 'update_device_state') {
            // Echo back to all clients (including sender if needed, but usually sender updates optimistic)
            // The BroadcastChannel above handles the "echo to others".
            // But usually server validates and sends 'device_state_updated'.
            this.channel?.postMessage({
                type: 'device_state_updated',
                data: data // { deviceId, state }
            });
            // Also notify self
            this.notifyListeners('device_state_updated', data);
        }
    }
}

export default CommManager.getInstance();
