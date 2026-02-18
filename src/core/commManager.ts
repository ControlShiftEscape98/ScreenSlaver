import { io, Socket } from 'socket.io-client';

class CommManager {
    private static instance: CommManager;
    private socket: Socket | null = null;
    private url: string = 'http://localhost:3001'; // Default to local for V1/Dev

    private constructor() { }

    public static getInstance(): CommManager {
        if (!CommManager.instance) {
            CommManager.instance = new CommManager();
        }
        return CommManager.instance;
    }

    public connect(url?: string): Socket {
        if (this.socket?.connected) return this.socket;

        this.url = url || this.url;

        this.socket = io(this.url, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

        this.setupListeners();
        return this.socket;
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    public emit(event: string, data?: any): void {
        if (this.socket) {
            this.socket.emit(event, data);
        } else {
            console.warn('CommManager: Cannot emit, socket not connected.');
        }
    }

    public on(event: string, callback: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    public off(event: string): void {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    private setupListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('CommManager: Connected to', this.url);
        });

        this.socket.on('disconnect', () => {
            console.log('CommManager: Disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.error('CommManager: Connection Error:', err.message);
        });
    }
}

export default CommManager.getInstance();
