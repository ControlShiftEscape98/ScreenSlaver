import { useState, useEffect } from 'react';
import { useModeStore } from '../core/modeManager';
import { useSessionStore } from '../core/sessionManager';
import type { DeviceType } from '../types';
import { IconDevicePhone } from './components/Icons';

// Skins
import VirtualKeyboard from './skins/VirtualKeyboard';
import { IOSLockScreen, AndroidLockScreen, GenericHomeScreen, IncomingCallSkin } from './ReceiverComponents';
import { QuickToolRenderer } from './components/QuickToolRenderer';

type ReceiverMode = 'lock' | 'home' | 'keyboard' | 'call' | 'idle';
type SkinTheme = 'ios' | 'android';

export default function ReceiverView() {
    const { setMode } = useModeStore();
    const { connected, joinSession, myDeviceState } = useSessionStore();

    // Local state for demo/prop functionality
    const [deviceName, setDeviceName] = useState('');
    const [deviceType, setDeviceTypeState] = useState<DeviceType>('phone');
    const { setDeviceType } = useSessionStore();
    const [sessionCode, setSessionCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    // Prop State (Initialized from myDeviceState if available)
    const [isDemoMode, setIsDemoMode] = useState(false); // Bypass session for testing
    const [viewMode, setViewMode] = useState<ReceiverMode>('lock');
    const [skinTheme, setSkinTheme] = useState<SkinTheme>('ios');
    const [showDebug, setShowDebug] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [paramTripleTap, setParamTripleTap] = useState(0);

    // Status Bar State
    const [battery, setBattery] = useState(100);
    const [signal, setSignal] = useState(4);

    // Sync from SessionStore
    useEffect(() => {
        if (myDeviceState) {
            setViewMode(myDeviceState.currentApp as ReceiverMode);
            setSkinTheme(myDeviceState.skin as SkinTheme);
            setTypedText(myDeviceState.typedText || '');
            setBattery(myDeviceState.battery);
            setSignal(myDeviceState.signal as any);
        }
    }, [myDeviceState]);

    // Triple tap logic to show debug menu
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (paramTripleTap > 0) {
            timer = setTimeout(() => setParamTripleTap(0), 400);
        }
        if (paramTripleTap >= 3) {
            setShowDebug(prev => !prev);
            setParamTripleTap(0);
        }
        return () => clearTimeout(timer);
    }, [paramTripleTap]);

    const handleScreenTap = () => {
        setParamTripleTap(prev => prev + 1);
    };

    const handleUnlock = () => {
        setViewMode('home');
    };

    // Render the active prop skin
    const renderContent = () => {
        if (myDeviceState?.displayTool) {
            return (
                <div className="w-full h-full pointer-events-none">
                    <QuickToolRenderer
                        tool={myDeviceState.displayTool}
                        gridOverlay={myDeviceState.displayToolGrid}
                    />
                </div>
            );
        }

        const time = new Date();

        switch (viewMode) {
            case 'lock':
                return skinTheme === 'ios'
                    ? <IOSLockScreen deviceType={deviceType} currentTime={time} onUnlock={handleUnlock} batteryLevel={battery} signalStrength={signal} />
                    : <AndroidLockScreen deviceType={deviceType} currentTime={time} onUnlock={handleUnlock} batteryLevel={battery} signalStrength={signal} />;

            case 'home':
                return <GenericHomeScreen theme={skinTheme} />;

            case 'call':
                return (
                    <IncomingCallSkin
                        contactName="Director"
                        onAccept={() => setViewMode('home')} // Demo logic
                        onDecline={() => setViewMode('home')}
                    />
                );

            case 'keyboard':
                return (
                    <div className="w-full h-full flex flex-col bg-white">
                        {/* Text Area */}
                        <div className="flex-1 p-4 bg-surface-100 text-black text-2xl font-mono whitespace-pre-wrap break-words overflow-y-auto">
                            {typedText}<span className="animate-pulse">|</span>
                        </div>
                        {/* Keyboard */}
                        <VirtualKeyboard
                            theme={skinTheme}
                            onType={(char) => setTypedText(prev => prev + char)}
                            onDelete={() => setTypedText(prev => prev.slice(0, -1))}
                            onEnter={() => setTypedText(prev => prev + '\n')}
                        />
                    </div>
                );

            case 'idle':
            default:
                return (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-white/10 animate-pulse" />
                    </div>
                );
        }
    };

    // If connected OR in demo mode, show prop interface
    if (connected || isDemoMode) {
        return (
            <div className="h-full w-full relative overflow-hidden bg-black select-none" onClick={handleScreenTap}>

                {renderContent()}

                {/* Triple Tap Debug Overlay */}
                {showDebug && (
                    <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4 text-white z-[100] border-b border-white/20 animate-slide-down">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-accent-500">Prop Control</h3>
                            <button onClick={(e) => { e.stopPropagation(); setShowDebug(false); }} className="text-neutral-400">✕</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-[10px] text-neutral-500 block mb-1">MODE</label>
                                <div className="flex flex-wrap gap-1">
                                    {(['lock', 'home', 'call', 'keyboard'] as ReceiverMode[]).map(m => (
                                        <button
                                            key={m}
                                            onClick={(e) => { e.stopPropagation(); setViewMode(m); }}
                                            className={`px-2 py-1 text-xs rounded border ${viewMode === m ? 'bg-accent-500 border-accent-500' : 'bg-transparent border-white/20'}`}
                                        >
                                            {m.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-neutral-500 block mb-1">THEME</label>
                                <div className="flex gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); setSkinTheme('ios'); }} className={`px-2 py-1 text-xs rounded border ${skinTheme === 'ios' ? 'bg-white text-black' : 'bg-transparent border-white/20'}`}>iOS</button>
                                    <button onClick={(e) => { e.stopPropagation(); setSkinTheme('android'); }} className={`px-2 py-1 text-xs rounded border ${skinTheme === 'android' ? 'bg-green-600 border-green-600' : 'bg-transparent border-white/20'}`}>ANDRO</button>
                                </div>
                            </div>
                        </div>

                        {!connected && (
                            <button
                                onClick={() => setIsDemoMode(false)}
                                className="w-full py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg text-xs font-bold"
                            >
                                EXIT DEMO
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Join form
    return (
        <div className="h-full flex flex-col bg-surface-base">
            <header className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
                <button onClick={() => setMode('home')} className="btn-ghost text-sm flex items-center gap-1.5 bg-surface-100/50 hover:bg-surface-100">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 1L4 7l6 6" />
                    </svg>
                    Home
                </button>
                <div>
                    <h1 className="text-lg font-bold text-white">Receiver Mode</h1>
                    <p className="text-xs text-neutral-500">Turn this device into a prop</p>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center px-6">
                <div className="glass-panel-elevated p-8 w-full max-w-md animate-float-in">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shadow-lg shadow-accent-500/10">
                            <IconDevicePhone className="w-10 h-10 text-accent-500" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white text-center mb-1">Join a Session</h2>
                    <p className="text-sm text-neutral-500 text-center mb-6">Enter your details to connect as a prop device</p>

                    {/* Simple Form - Functional for Demo */}
                    <div className="mb-4">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Device Name</label>
                        <input
                            type="text"
                            value={deviceName}
                            onChange={e => setDeviceName(e.target.value)}
                            placeholder="e.g., Hero Phone A"
                            className="input-field w-full"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Session Code</label>
                        <input
                            type="text"
                            value={sessionCode}
                            onChange={e => setSessionCode(e.target.value)}
                            placeholder="6-Digit Code"
                            className="input-field w-full font-mono text-center tracking-widest text-lg"
                        />
                    </div>

                    <button
                        onClick={async () => {
                            setIsJoining(true);
                            try {
                                setDeviceType(deviceType);
                                await joinSession(sessionCode, deviceName);
                            } catch (err) {
                                console.error("Join failed", err);
                            } finally {
                                setIsJoining(false);
                            }
                        }}
                        disabled={!sessionCode || !deviceName || isJoining}
                        className="w-full py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed mb-3 shadow-glow-accent"
                    >
                        {isJoining ? 'Connecting...' : 'Join Session'}
                    </button>

    // Demo Button
                    <button
                        onClick={() => setDeviceTypeState('phone')} // Example usage or just keeping the setter
                        className="w-full py-3 bg-surface-200 text-neutral-300 font-bold rounded-xl hover:bg-surface-100 hover:text-white border border-white/5 transition-all"
                    >
                        Enter Offline Demo Mode
                    </button>
                </div>
            </div>
        </div>
    );
}

// Inline Icon Components if needed, or import from previous file if I didn't verify they export correctly. 
// I imported them from './components/Icons'.
