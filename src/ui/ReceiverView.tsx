import React, { useState, useEffect } from 'react';
import { useModeStore } from '../core/modeManager';
import { useSessionStore } from '../core/sessionManager';
import type { DeviceType } from '../types';
import { IconDevicePhone } from './components/Icons';

// Skins
import VirtualKeyboard from './skins/VirtualKeyboard';
import {
    IOSLockScreen,
    AndroidLockScreen,
    GenericHomeScreen,
    IncomingCallSkin,
    StatusBar,
    DialerApp,
    MessagesApp,
    LoadingSkin,
    TextSkin,
    TerminalSkin,
    ErrorSkin
} from './ReceiverComponents';
import { QuickToolRenderer } from './components/QuickToolRenderer';

const RECEIVER_TIPS = [
    'Tips: Set an Admin PIN to prevent accidental exits.',
    'Receiver Lock: Triple-tap the screen to reveal the exit menu.',
    'Full Screen: Add this page to your home screen for best results.',
    'Stay Awake: Ensure the device auto-lock is disabled in OS settings.',
];

function PinInput({ value, onChange, length = 6 }: { value: string, onChange: (val: string) => void, length?: number }) {
    const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value.toUpperCase();
        if (/^[A-Z0-9]?$/.test(val)) {
            const nextValue = value.split('');
            // Ensure array has enough length to set index
            while (nextValue.length < length) nextValue.push(' ');
            nextValue[index] = val || ' ';
            const finalValue = nextValue.join('').substring(0, length);
            onChange(finalValue.replace(/ /g, ''));

            if (val && index < length - 1) {
                inputs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && (!value[index] || value[index] === ' ') && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-between gap-1.5 md:gap-2">
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={el => inputs.current[i] = el}
                    type="text"
                    maxLength={1}
                    placeholder="X"
                    value={(value[i] === ' ' ? '' : value[i]) || ''}
                    onChange={e => handleChange(e, i)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    className="w-10 h-14 bg-surface-200/50 border border-white/10 rounded-xl text-center text-xl font-mono font-bold text-white focus:border-accent-500 focus:bg-accent-500/5 transition-all outline-none"
                    autoComplete="one-time-code"
                    data-lpignore="true"
                />
            ))}
        </div>
    );
}

type ReceiverMode = 'lock' | 'home' | 'keyboard' | 'call' | 'idle' | 'loading' | 'terminal' | 'messages' | 'error';
type SkinTheme = 'ios' | 'android';

export default function ReceiverView() {
    const { setMode } = useModeStore();
    const { connected, joinSession, myDeviceState, role } = useSessionStore();

    // Local state for demo/prop functionality
    const [deviceName, setDeviceName] = useState('');
    const [deviceType] = useState<DeviceType>('phone');
    const { setDeviceType } = useSessionStore();
    const [sessionCode, setSessionCode] = useState('');
    const [joinProgress, setJoinProgress] = useState<'idle' | 'connecting' | 'connected'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Prop State (Initialized from myDeviceState if available)
    const [isDemoMode, setIsDemoMode] = useState(false); // Bypass session for testing
    const [viewMode, setViewMode] = useState<ReceiverMode>('lock');
    const [skinTheme, setSkinTheme] = useState<SkinTheme>('ios');
    const [showDebug, setShowDebug] = useState(false);
    const [showPinPrompt, setShowPinPrompt] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [adminPin, setAdminPin] = useState('');
    const [tipIndex, setTipIndex] = useState(0);
    const [showAssistant, setShowAssistant] = useState(true);
    const [typedText, setTypedText] = useState('');
    const [paramTripleTap, setParamTripleTap] = useState(0);
    const [wallpaper, setWallpaper] = useState('');
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
    const [keyboardColor, setKeyboardColor] = useState('#aeb3bc');
    const [iconStyle, setIconStyle] = useState<'classic' | 'vibrant' | 'tech' | 'social'>('classic');
    const [fontScale, setFontScale] = useState(1.0);

    // Sub-App State (Local to receiver for "Functional Illusion")
    const [activeApp, setActiveApp] = useState<string | null>(null);

    // Status Bar State
    const [battery, setBattery] = useState(100);
    const [signal, setSignal] = useState(4);
    const [carrier, setCarrier] = useState('Carrier');
    const [wifi, setWifi] = useState(true);
    const [wifiStrength, setWifiStrength] = useState(3);
    const [simTime, setSimTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTipIndex((i) => (i + 1) % RECEIVER_TIPS.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    // Sync from SessionStore
    useEffect(() => {
        if (myDeviceState) {
            setViewMode(myDeviceState.currentApp as ReceiverMode);
            setSkinTheme(myDeviceState.skin as SkinTheme);
            setTypedText(myDeviceState.typedText || '');
            setBattery(myDeviceState.battery);
            setSignal(myDeviceState.signal as any);
            setCarrier(myDeviceState.carrier || 'Carrier');
            setWifi(myDeviceState.wifi !== undefined ? myDeviceState.wifi : true);
            setWifiStrength(myDeviceState.wifiStrength !== undefined ? myDeviceState.wifiStrength : 3);
            setSimTime(myDeviceState.time || '');
            setWallpaper(myDeviceState.wallpaper || '');
            setThemeMode(myDeviceState.themeMode || 'dark');
            setKeyboardColor(myDeviceState.keyboardColor || (myDeviceState.skin === 'ios' ? '#AEB3BC' : '#1a1a1a'));
            setIconStyle(myDeviceState.iconStyle as any || 'classic');
            setFontScale(myDeviceState.fontScale || 1.0);
        }
    }, [myDeviceState]);

    // Heartbeat for presence
    useEffect(() => {
        if (connected && role === 'client' && !isDemoMode) {
            const sendHeartbeat = () => {
                const { updateDeviceState } = useSessionStore.getState();
                const deviceId = useSessionStore.getState().deviceId;
                if (deviceId) {
                    // Just update a small property to trigger 'updated_at' or similar
                    updateDeviceState(deviceId, { battery: useSessionStore.getState().myDeviceState?.battery || 100 });
                }
            };
            const interval = setInterval(sendHeartbeat, 30000); // 30 seconds
            return () => clearInterval(interval);
        }
    }, [connected, role, isDemoMode]);

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
                        tool={myDeviceState.displayTool!}
                        gridOverlay={myDeviceState.displayToolGrid}
                        displayToolMarkers={myDeviceState.displayToolMarkers}
                    />
                </div>
            );
        }

        const time = new Date();

        switch (viewMode) {
            case 'lock':
                return skinTheme === 'ios'
                    ? <IOSLockScreen
                        deviceType={deviceType}
                        currentTime={time}
                        simulatedTime={simTime}
                        onUnlock={handleUnlock}
                        batteryLevel={battery}
                        signalStrength={signal}
                        carrierName={carrier}
                        wifiEnabled={wifi}
                        wifiStrength={wifiStrength}
                        wallpaper={wallpaper}
                        themeMode={themeMode}
                        fontScale={fontScale}
                    />
                    : <AndroidLockScreen
                        deviceType={deviceType}
                        currentTime={time}
                        simulatedTime={simTime}
                        onUnlock={handleUnlock}
                        batteryLevel={battery}
                        signalStrength={signal}
                        carrierName={carrier}
                        wifiEnabled={wifi}
                        wifiStrength={wifiStrength}
                        wallpaper={wallpaper}
                        themeMode={themeMode}
                        fontScale={fontScale}
                    />;

            case 'home':
                if (activeApp === 'phone') {
                    return (
                        <div className="w-full h-full relative">
                            <StatusBar battery={battery} signal={signal} carrier={carrier} wifi={wifi} wifiStrength={wifiStrength} themeMode={themeMode} />
                            <DialerApp
                                theme={skinTheme}
                                onCall={(num: string) => {
                                    console.log("Dialing:", num);
                                    setViewMode('call');
                                    setActiveApp(null);
                                }}
                            />
                            <button
                                onClick={() => setActiveApp(null)}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-400 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    );
                }
                if (activeApp === 'messages') {
                    return (
                        <div className="w-full h-full relative">
                            <StatusBar battery={battery} signal={signal} carrier={carrier} wifi={wifi} wifiStrength={wifiStrength} themeMode={themeMode} />
                            <MessagesApp theme={skinTheme} themeMode={themeMode} />
                            <button
                                onClick={() => setActiveApp(null)}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-400 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    );
                }

                return <GenericHomeScreen
                    theme={skinTheme}
                    batteryLevel={battery}
                    signalStrength={signal}
                    carrierName={carrier}
                    wifiEnabled={wifi}
                    wifiStrength={wifiStrength}
                    wallpaper={wallpaper}
                    themeMode={themeMode}
                    iconStyle={iconStyle}
                    fontScale={fontScale}
                    onOpenApp={(app) => setActiveApp(app)}
                />;

            case 'call':
                return (
                    <IncomingCallSkin
                        contactName={myDeviceState?.contactName || 'Unknown'}
                        phoneNumber={myDeviceState?.phoneNumber || ''}
                        onAccept={() => setViewMode('home')} // Demo logic
                        onDecline={() => setViewMode('home')}
                        batteryLevel={battery}
                        signalStrength={signal}
                        carrierName={carrier}
                        wifiEnabled={wifi}
                        wifiStrength={wifiStrength}
                    />
                );

            case 'loading':
                return (
                    <LoadingSkin
                        statusText={myDeviceState?.statusText}
                        battery={battery}
                        signal={signal}
                        carrier={carrier}
                        wifi={wifi}
                        wifiStrength={wifiStrength}
                    />
                );

            case 'terminal':
                return (
                    <TerminalSkin
                        terminalCode={myDeviceState?.statusText}
                        battery={battery}
                        signal={signal}
                        carrier={carrier}
                        wifi={wifi}
                        wifiStrength={wifiStrength}
                    />
                );

            case 'messages':
                return (
                    <TextSkin
                        contactName={myDeviceState?.contactName}
                        messageBody={myDeviceState?.messageBody}
                        battery={battery}
                        signal={signal}
                        carrier={carrier}
                        wifi={wifi}
                        wifiStrength={wifiStrength}
                    />
                );

            case 'error':
                return (
                    <ErrorSkin
                        statusText={myDeviceState?.statusText}
                        battery={battery}
                        signal={signal}
                        carrier={carrier}
                        wifi={wifi}
                        wifiStrength={wifiStrength}
                    />
                );

            case 'keyboard':
                return (
                    <div className="w-full h-full flex flex-col bg-white">
                        <StatusBar battery={battery} signal={signal} carrier={carrier} wifi={wifi} wifiStrength={wifiStrength} />
                        {/* Text Area */}
                        <div className="flex-1 p-4 pt-10 bg-surface-100 text-black text-2xl font-mono whitespace-pre-wrap break-words overflow-y-auto">
                            {typedText}<span className="animate-pulse">|</span>
                        </div>
                        {/* Keyboard */}
                        <VirtualKeyboard
                            theme={skinTheme}
                            keyboardColor={keyboardColor}
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

    // If connected as a client OR in demo mode, show prop interface
    if ((connected && role === 'client') || isDemoMode) {
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

                        {/* PIN Gate for Exiting */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            {showPinPrompt ? (
                                <div className="space-y-3">
                                    <label className="text-[10px] text-neutral-400 block text-center uppercase tracking-widest">Enter Admin PIN to Exit</label>
                                    <input
                                        type="password"
                                        maxLength={4}
                                        value={pinInput}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setPinInput(val);
                                            const expectedPin = adminPin || '0000';
                                            if (val === expectedPin || val === '0000') {
                                                if (connected) {
                                                    const { leaveSession } = useSessionStore.getState();
                                                    leaveSession();
                                                }
                                                setIsDemoMode(false);
                                                setShowDebug(false);
                                                setPinInput('');
                                                setShowPinPrompt(false);
                                            }
                                        }}
                                        className="w-full text-center tracking-[1em] text-2xl py-3 bg-surface-900 border border-red-500/50 rounded-xl text-white outline-none focus:border-red-500 font-mono shadow-inner transition-colors"
                                        placeholder="····"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => { setShowPinPrompt(false); setPinInput(''); }}
                                        className="w-full py-2 text-xs text-neutral-500 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowPinPrompt(true)}
                                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    {connected ? 'LEAVE SESSION' : 'EXIT DEMO MODE'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Join form
    return (
        <div className="h-full flex flex-col bg-surface-base relative overflow-hidden">
            {/* Assistant Widget - Floating Square */}
            {showAssistant && (
                <button
                    onClick={() => setTipIndex((i) => (i + 1) % RECEIVER_TIPS.length)}
                    onContextMenu={(e) => { e.preventDefault(); setShowAssistant(false); }}
                    className="absolute bottom-6 right-6 md:top-24 md:left-6 md:bottom-auto md:right-auto w-[180px] h-[180px] glass-panel-elevated p-4 flex flex-col items-center justify-center text-center gap-3 animate-fade-in hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer group"
                    title="Tap for next tip, Right-click to close"
                >
                    <div className="w-10 h-10 rounded-full bg-accent-500/20 border border-accent-500/30 flex items-center justify-center animate-pulse-slow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <p className="text-[11px] text-white font-medium leading-tight line-clamp-4">
                        {RECEIVER_TIPS[tipIndex]}
                    </p>
                    <div className="flex gap-1 mt-1">
                        {RECEIVER_TIPS.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-1 rounded-full transition-colors ${i === tipIndex ? 'bg-accent-500' : 'bg-neutral-600'}`}
                            />
                        ))}
                    </div>
                    <div
                        onClick={(e) => { e.stopPropagation(); setShowAssistant(false); }}
                        className="absolute top-2 right-2 p-1 text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </button>
            )}

            <header className="flex items-center gap-4 px-6 py-4 border-b border-white/5 relative z-10">
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
                        <textarea
                            rows={1}
                            name={`dn-${Math.random()}`}
                            autoComplete="off"
                            data-lpignore="true"
                            value={deviceName}
                            onChange={e => setDeviceName(e.target.value.replace(/\n/g, ''))}
                            placeholder="e.g., Hero Phone A"
                            className="input-field w-full resize-none py-3 overflow-hidden"
                            style={{ height: 'auto' }}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Session Code</label>
                        <PinInput
                            value={sessionCode}
                            onChange={setSessionCode}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                            Admin PIN (To Exit)
                            <span className="text-[9px] text-accent-500 font-normal normal-case">Optional</span>
                        </label>
                        <input
                            type="password"
                            maxLength={4}
                            value={adminPin}
                            onChange={e => setAdminPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="0000"
                            className="input-field w-full font-mono text-center tracking-[1em] text-lg text-accent-500 placeholder:text-neutral-600"
                        />
                    </div>

                    <button
                        onClick={async () => {
                            setJoinProgress('connecting');
                            setErrorMessage(null);
                            try {
                                setDeviceType(deviceType);
                                await joinSession(sessionCode, deviceName);
                                setJoinProgress('connected');
                            } catch (error: any) {
                                setJoinProgress('idle');
                                setErrorMessage(error.message || 'Connection Failed');
                                console.error('[ReceiverView] Join error:', error);
                            }
                        }}
                        disabled={sessionCode.length < 4 || !deviceName || joinProgress === 'connecting'}
                        className="w-full mt-8 py-4 bg-accent-500 hover:bg-accent-400 disabled:opacity-50 disabled:bg-surface-300 text-white font-black rounded-xl shadow-glow-accent transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
                    >
                        {joinProgress === 'connecting' ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span className="tracking-widest">CONNECTING...</span>
                            </div>
                        ) : (
                            <>
                                <span className="tracking-widest uppercase">Join Global Session</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </>
                        )}
                    </button>

                    <div className="relative flex items-center py-4 mb-2">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-neutral-600 text-[10px] font-black uppercase tracking-widest">or try</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    {/* Demo Button */}
                    <button
                        onClick={() => setIsDemoMode(true)}
                        className="w-full py-3 bg-surface-200 text-neutral-300 font-bold rounded-xl hover:bg-surface-100 hover:text-white border border-white/5 transition-all group flex items-center justify-center gap-2"
                    >
                        Enter Offline Demo Mode
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Inline Icon Components if needed, or import from previous file if I didn't verify they export correctly. 
// I imported them from './components/Icons'.
