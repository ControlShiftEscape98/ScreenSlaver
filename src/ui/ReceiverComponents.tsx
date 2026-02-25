import React from 'react';
import type { DeviceType } from '../types';

// --- Assets / Placeholders ---
const WALLPAPERS: Record<string, string> = {
    'ios': 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)',
    'android': 'linear-gradient(135deg, #203A43 0%, #2C5364 100%)',
    'black': 'linear-gradient(to bottom, #000000 0%, #111111 100%)',
    'neon-city': 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%), radial-gradient(circle at 20% 30%, rgba(255, 0, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
    'abstract-waves': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'crimson-dawn': 'linear-gradient(135deg, #870000 0%, #190a05 100%)',
    'royal-gold': 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)',
    'forest-mist': 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    'cyber-punk': 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)',
    'slate-night': 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    'sunset-beach': 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)',
    'arctic-ice': 'linear-gradient(135deg, #2980b9 0%, #6dd5fa 50%, #ffffff 100%)',
    'midnight-purple': 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)',
    'ocean-deep': 'linear-gradient(135deg, #021B79 0%, #0575E6 100%)',
    'volcanic-ash': 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
    'lavender-bliss': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
};

// --- App Icon Component ---
function AppIcon({ type, theme, style = 'classic' }: { type: string, theme: 'ios' | 'android', style?: string }) {
    const isIOS = theme === 'ios';
    const isVibrant = style === 'vibrant';
    const isTech = style === 'tech';
    const isSocial = style === 'social';

    const baseClass = `w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-90 ${isIOS ? 'rounded-[1.2rem]' : 'rounded-full'}`;

    const icons: Record<string, { bg: string, glyph: React.ReactNode }> = {
        messages: {
            bg: isTech ? 'bg-neutral-800' : isSocial ? 'bg-pink-400' : 'bg-[#34C759]',
            glyph: <svg width="32" height="32" viewBox="0 0 24 24" fill={isVibrant ? '#00ff00' : 'white'}><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
        },
        phone: {
            bg: isTech ? 'bg-neutral-900 border border-white/10' : isSocial ? 'bg-purple-400' : 'bg-[#29cf5f]',
            glyph: <svg width="28" height="28" viewBox="0 0 24 24" fill={isVibrant ? '#3efc03' : 'white'}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
        },
        camera: { bg: 'bg-[#8E8E93]', glyph: <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3.2" /><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" /></svg> },
        settings: { bg: 'bg-[#8E8E93]', glyph: <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg> },
        browser: { bg: 'bg-[#007AFF]', glyph: <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.09.66-.14 1.32-.14 2 0 .68.05 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.91-4.33-3.56zm2.95-8H5.08c.96-1.65 2.49-2.93 4.33-3.56-.6 1.11-1.06 2.31-1.38 3.56zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.09-.66.14-1.32.14-2 0-.68-.05-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" /></svg> },
        photos: { bg: 'bg-white', glyph: <div className="grid grid-cols-2 gap-0.5"><div className="w-2.5 h-2.5 bg-red-400 rounded-full" /><div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" /><div className="w-2.5 h-2.5 bg-green-400 rounded-full" /><div className="w-2.5 h-2.5 bg-blue-400 rounded-full" /></div> },
        mail: { bg: 'bg-[#5856D6]', glyph: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg> },
        music: { bg: 'linear-gradient(to bottom, #FF5E5E, #FF2D55)', glyph: <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg> },
    };

    const icon = icons[type] || { bg: 'bg-white/20', glyph: <div className="w-6 h-6 rounded bg-white/40" /> };

    return (
        <div className={`${baseClass} ${icon.bg}`}>
            {icon.glyph}
        </div>
    );
}

// --- Dialer App ---
export function DialerApp({ theme, onCall }: { theme: 'ios' | 'android', onCall: (num: string) => void }) {
    const isIOS = theme === 'ios';
    const [number, setNumber] = React.useState('');

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

    return (
        <div className={`w-full h-full p-8 flex flex-col justify-end gap-10 animate-fade-in ${isIOS ? 'bg-white/90' : 'bg-[#FAFAFA]'}`}>
            <div className="flex-1 flex items-center justify-center">
                <span className={`text-4xl font-light ${isIOS ? 'text-black' : 'text-neutral-700'} tracking-widest min-h-[1em]`}>
                    {number}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-y-6 gap-x-10 justify-items-center">
                {keys.map(k => (
                    <button
                        key={k}
                        onClick={() => setNumber(prev => prev + k)}
                        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all active:scale-90 shadow-sm
                            ${isIOS ? 'bg-neutral-100 hover:bg-neutral-200 text-black' : 'bg-white border border-neutral-200 text-neutral-600'}`}
                    >
                        <span className="text-2xl font-normal">{k}</span>
                    </button>
                ))}
            </div>

            <div className="flex justify-center pb-10">
                <button
                    onClick={() => onCall(number)}
                    className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg active:scale-95"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                </button>
            </div>
        </div>
    );
}

// --- Messages App ---
export function MessagesApp({ theme, themeMode }: { theme: 'ios' | 'android', themeMode: 'light' | 'dark' }) {
    const isIOS = theme === 'ios';
    const isLight = themeMode === 'light';
    const [messages, setMessages] = React.useState<{ id: number, text: string, type: 'sent' | 'received' }[]>([
        { id: 1, text: "Hey! Are you on set yet?", type: 'received' },
        { id: 2, text: "Just parked, heading to base.", type: 'sent' },
        { id: 3, text: "Cool, DP wants to test the phone screen for Sc. 4", type: 'received' }
    ]);
    const [draft, setDraft] = React.useState('');

    return (
        <div className={`w-full h-full flex flex-col animate-fade-in ${isLight ? 'bg-white' : 'bg-black'}`}>
            {/* Header */}
            <div className={`p-4 pt-12 text-center border-b ${isLight ? 'border-neutral-100' : 'border-neutral-800'}`}>
                <div className={`w-10 h-10 rounded-full mx-auto mb-1 ${isIOS ? 'bg-neutral-200' : 'bg-neutral-600'} flex items-center justify-center text-xs`}>DP</div>
                <h3 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>Director of Photography</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map(m => (
                    <div key={m.id} className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.type === 'sent'
                        ? (isIOS ? 'bg-[#007AFF] text-white self-end rounded-br-none' : 'bg-accent-500 text-white self-end rounded-br-none')
                        : (isLight ? 'bg-[#E9E9EB] text-black self-start rounded-bl-none' : 'bg-neutral-800 text-white self-start rounded-bl-none')
                        }`}>
                        {m.text}
                    </div>
                ))}
            </div>

            <div className={`p-4 pb-10 border-t ${isLight ? 'border-neutral-100' : 'border-neutral-800'} flex items-center gap-2`}>
                <div className={`flex-1 ${isLight ? 'bg-[#F2F2F7]' : 'bg-neutral-900'} rounded-full px-4 py-2 border ${isLight ? 'border-neutral-200' : 'border-white/5'}`}>
                    <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="iMessage"
                        className="w-full bg-transparent border-none outline-none text-sm text-neutral-400 placeholder:opacity-50"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && draft) {
                                setMessages(prev => [...prev, { id: Date.now(), text: draft, type: 'sent' }]);
                                setDraft('');
                            }
                        }}
                    />
                </div>
                <button
                    onClick={() => {
                        if (draft) {
                            setMessages(prev => [...prev, { id: Date.now(), text: draft, type: 'sent' }]);
                            setDraft('');
                        }
                    }}
                    className={`w-8 h-8 rounded-full ${isIOS ? 'bg-[#007AFF]' : 'bg-accent-500'} flex items-center justify-center text-white`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                </button>
            </div>
        </div>
    );
}

// --- Interfaces ---
interface SkinProps {
    deviceType: DeviceType;
    currentTime: Date;
    simulatedTime?: string;
    onUnlock?: () => void;
    batteryLevel?: number;
    signalStrength?: number;
    carrierName?: string;
    wifiEnabled?: boolean;
    wifiStrength?: number;
    wallpaper?: string;
    themeMode?: 'light' | 'dark';
    iconStyle?: 'classic' | 'vibrant' | 'tech' | 'social';
    fontScale?: number;
}

export function StatusBar({
    battery = 100,
    signal = 4,
    carrier = 'Carrier',
    wifi = true,
    wifiStrength = 3,
    themeMode = 'dark',
    simTime = ''
}: {
    battery?: number,
    signal?: number,
    carrier?: string,
    wifi?: boolean,
    wifiStrength?: number,
    themeMode?: 'light' | 'dark',
    simTime?: string
}) {
    const isLight = themeMode === 'light';
    const textColor = isLight ? 'text-black/80' : 'text-white';
    const barBg = isLight ? 'bg-black/20' : 'bg-white/20';
    const barActive = isLight ? 'bg-black/80' : 'bg-white';

    // WiFi Cone SVG
    const WifiIcon = ({ strength }: { strength: number }) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-1">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" opacity={strength >= 1 ? 1 : 0.3} />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" opacity={strength >= 2 ? 1 : 0.3} />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" opacity={strength >= 0 ? 1 : 0.3} />
            <line x1="12" y1="20" x2="12.01" y2="20" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="absolute top-0 left-0 right-0 px-6 py-2 flex justify-between items-center z-[100]">
            <div className="flex gap-1 items-center">
                {simTime && (
                    <span className={`text-[10px] font-bold ${textColor} mr-2`}>
                        {simTime}
                    </span>
                )}
                <div className="flex gap-[2px] items-end h-3 mr-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 rounded-sm ${i < signal ? barActive : barBg}`}
                            style={{ height: (i + 1) * 2 + 4 }}
                        />
                    ))}
                </div>
                <span className={`text-[10px] font-bold ${textColor}`}>{carrier}</span>
                {wifi && <div className={textColor}><WifiIcon strength={wifiStrength} /></div>}
            </div>
            <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold ${textColor}`}>{battery}%</span>
                <div className={`w-5 h-2.5 border ${isLight ? 'border-black/20' : 'border-white/40'} rounded-sm relative flex items-center p-[1px]`}>
                    <div className={barActive} style={{ width: `${battery}%`, height: '100%' }} />
                    <div className={`absolute -right-1 w-0.5 h-1 ${isLight ? 'bg-black/20' : 'bg-white/40'} rounded-full`} />
                </div>
            </div>
        </div>
    );
}

// --- iOS Lock Screen ---
export function IOSLockScreen({ currentTime, simulatedTime, onUnlock, batteryLevel, signalStrength, carrierName, wifiEnabled, wifiStrength, wallpaper }: SkinProps) {
    const displayTime = simulatedTime || currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    const bg = wallpaper && WALLPAPERS[wallpaper] ? WALLPAPERS[wallpaper] : WALLPAPERS.ios;

    return (
        <div className="w-full h-full flex flex-col items-center text-white relative animate-fade-in"
            style={{ background: bg }}
            onClick={onUnlock}
        >
            <StatusBar battery={batteryLevel} signal={signalStrength} carrier={carrierName} wifi={wifiEnabled} wifiStrength={wifiStrength} />
            <div className="mt-16 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M12 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h1 className="text-8xl font-thin tracking-tight">
                    {displayTime}
                </h1>
                <p className="text-xl font-medium mt-2">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="mt-auto mb-10 opacity-60 flex flex-col items-center gap-2 animate-pulse-slow">
                <div className="w-12 h-1 bg-white rounded-full" />
                <span className="text-xs font-semibold tracking-wide">Swipe up to open</span>
            </div>
        </div>
    );
}

// --- Android Lock Screen ---
export function AndroidLockScreen({ currentTime, simulatedTime, onUnlock, batteryLevel, signalStrength, carrierName, wifiEnabled, wifiStrength, wallpaper }: SkinProps) {
    const displayTime = simulatedTime || currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    const bg = wallpaper && WALLPAPERS[wallpaper] ? WALLPAPERS[wallpaper] : WALLPAPERS.android;

    return (
        <div className="w-full h-full flex flex-col pl-8 text-white relative animate-fade-in"
            style={{ background: bg }}
            onClick={onUnlock}
        >
            <StatusBar battery={batteryLevel} signal={signalStrength} carrier={carrierName} wifi={wifiEnabled} wifiStrength={wifiStrength} />
            <div className="mt-24 text-left">
                <h1 className="text-7xl font-normal leading-none text-[#B3E5FC]">
                    {displayTime}
                </h1>
                <p className="text-lg text-[#B3E5FC]/80 mt-1 font-medium">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
            </div>
            <div className="mt-auto mb-10 w-full flex justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B3E5FC" strokeWidth="2"><path d="M7 11v-4a5 5 0 0 1 10 0v4" /><rect x="5" y="11" width="14" height="10" rx="2" /></svg>
            </div>
        </div>
    );
}

// --- Incoming Call ---
export function IncomingCallSkin({
    contactName = "Unknown",
    phoneNumber = "",
    onAccept,
    onDecline,
    batteryLevel,
    signalStrength,
    carrierName,
    wifiEnabled,
    wifiStrength,
    fontScale = 1.0
}: {
    contactName?: string,
    phoneNumber?: string,
    onAccept: () => void,
    onDecline: () => void,
    batteryLevel?: number,
    signalStrength?: number,
    carrierName?: string,
    wifiEnabled?: boolean,
    wifiStrength?: number,
    fontScale?: number
}) {
    const [isAccepted, setIsAccepted] = React.useState(false);
    const [seconds, setSeconds] = React.useState(0);

    React.useEffect(() => {
        let interval: any;
        if (isAccepted) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isAccepted]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAcceptClick = () => {
        setIsAccepted(true);
        // Inform parents/listeners that call was accepted
        onAccept();
    };

    return (
        <div
            className="w-full h-full bg-black/90 backdrop-blur-xl flex flex-col items-center pt-20 pb-20 text-white relative z-50 animate-slide-up"
            style={{ fontSize: `${fontScale}rem` }}
        >
            <StatusBar battery={batteryLevel} signal={signalStrength} carrier={carrierName} wifi={wifiEnabled} wifiStrength={wifiStrength} />
            <div className="w-32 h-32 rounded-full bg-neutral-700 mb-6 flex items-center justify-center text-4xl font-bold text-neutral-400">
                {contactName[0]}
            </div>
            <h2 className="text-3xl font-bold mb-2">{contactName}</h2>

            {isAccepted ? (
                <p className="text-green-500 font-mono text-xl mb-auto animate-pulse">{formatTime(seconds)}</p>
            ) : (
                <p className="text-neutral-400 mb-auto">{phoneNumber || 'mobile'}</p>
            )}

            <div className="w-full px-12 flex justify-center items-center">
                {isAccepted ? (
                    <button
                        onClick={onDecline}
                        className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.7-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.7.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" /></svg>
                    </button>
                ) : (
                    <div className="w-full flex justify-between items-center">
                        <button
                            onClick={onDecline}
                            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.7-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.7.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" /></svg>
                        </button>
                        <button
                            onClick={handleAcceptClick}
                            className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 animate-pulse"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Loading Skin ---
export function LoadingSkin({ statusText = "Loading...", battery, signal, carrier, wifi, wifiStrength, fontScale = 1.0 }: any) {
    return (
        <div
            className="w-full h-full bg-black flex flex-col items-center justify-center p-12 text-white relative z-50"
            style={{ fontSize: `${fontScale}rem` }}
        >
            <StatusBar battery={battery} signal={signal} carrier={carrier} wifi={wifi} wifiStrength={wifiStrength} />
            <div className="w-full max-w-xs space-y-4 text-center">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-accent-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                </div>
                <p className="text-xs font-mono tracking-widest text-neutral-400 uppercase">{statusText}</p>
            </div>
        </div>
    );
}

// --- Text/Message Skin ---
export function TextSkin({ contactName, messageBody, battery, signal, carrier, wifi, wifiStrength, fontScale = 1.0 }: any) {
    return (
        <div
            className="w-full h-full bg-black flex flex-col p-6 text-white relative z-50 animate-fade-in"
            style={{ fontSize: `${fontScale}rem` }}
        >
            <StatusBar battery={battery} signal={signal} carrier={carrier} wifi={wifi} wifiStrength={wifiStrength} />
            <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-neutral-400">
                        {contactName?.[0] || 'U'}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{contactName}</h3>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">iMessage</p>
                    </div>
                </div>
                <div className="bg-neutral-900 border border-white/5 p-4 rounded-2xl rounded-tl-none relative animate-slide-up">
                    <p className="text-sm leading-relaxed text-neutral-200">{messageBody}</p>
                </div>
            </div>
        </div>
    );
}

// --- Terminal Skin ---
export function TerminalSkin({ terminalCode = "system.init()", battery, signal, carrier, wifi, wifiStrength, fontScale = 1.0 }: any) {
    const [lines, setLines] = React.useState<string[]>([]);

    React.useEffect(() => {
        const fullLines = terminalCode.split('\n');
        let i = 0;
        const interval = setInterval(() => {
            if (i < fullLines.length) {
                setLines(prev => [...prev, fullLines[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [terminalCode]);

    return (
        <div
            className="w-full h-full bg-black p-6 font-mono text-xs overflow-hidden flex flex-col text-green-500 relative z-50"
            style={{ fontSize: `${fontScale}rem` }}
        >
            <StatusBar battery={battery} signal={signal} carrier={carrier} wifi={wifi} wifiStrength={wifiStrength} themeMode="dark" />
            <div className="mt-12 flex-1 overflow-y-auto scrollbar-hide space-y-1">
                {lines.map((line, idx) => (
                    <div key={idx} className="flex gap-2">
                        <span className="opacity-40">[{idx.toString().padStart(3, '0')}]</span>
                        <span className="break-all">{line}</span>
                    </div>
                ))}
                <div className="w-2 h-4 bg-green-500 animate-pulse inline-block" />
            </div>
        </div>
    );
}

// --- Error Skin ---
export function ErrorSkin({ statusText = "System Failure", battery, signal, carrier, wifi, wifiStrength, fontScale = 1.0 }: any) {
    return (
        <div
            className="w-full h-full bg-[#0000AA] flex flex-col p-12 text-white font-mono z-50 relative"
            style={{ fontSize: `${fontScale}rem` }}
        >
            <StatusBar battery={battery} signal={signal} carrier={carrier} wifi={wifi} wifiStrength={wifiStrength} />
            <div className="mt-20 max-w-md">
                <div className="bg-white text-[#0000AA] px-4 py-1 mb-6 inline-block font-bold">WINDOWS</div>
                <h1 className="text-2xl mb-8">A problem has been detected and ScreenSlaver has been shut down to prevent damage to your device.</h1>
                <p className="mb-4">ERROR_CODE: {statusText.toUpperCase().replace(/\s/g, '_')}</p>
                <p className="opacity-80">*** STOP: 0x0000001E (0xC0000005, 0xFDE38AF9, 0x00000001, 0x7E8B0EB8)</p>
                <div className="mt-20 animate-pulse">Press any key to terminate..._</div>
            </div>
        </div>
    );
}

// --- Home Screen (Simple) ---
export function GenericHomeScreen({
    theme = 'ios',
    batteryLevel,
    signalStrength,
    carrierName,
    wifiEnabled,
    wifiStrength,
    wallpaper,
    themeMode = 'dark',
    iconStyle = 'classic',
    fontScale = 1.0,
    onOpenApp
}: {
    theme: 'ios' | 'android',
    batteryLevel?: number,
    signalStrength?: number,
    carrierName?: string,
    wifiEnabled?: boolean,
    wifiStrength?: number,
    wallpaper?: string,
    themeMode?: 'light' | 'dark',
    iconStyle?: 'classic' | 'vibrant' | 'tech' | 'social',
    fontScale?: number,
    onOpenApp?: (app: string) => void
}) {
    const bg = wallpaper && WALLPAPERS[wallpaper] ? WALLPAPERS[wallpaper] : (theme === 'ios' ? WALLPAPERS.ios : WALLPAPERS.android);

    // Define some mockup apps
    const apps = [
        'messages', 'phone', 'browser', 'photos',
        'mail', 'music', 'camera', 'settings'
    ];

    const isLight = themeMode === 'light';

    return (
        <div className={`w-full h-full relative overflow-hidden transition-all duration-500`} style={{ background: bg, fontSize: `${(fontScale || 1.0) * 100}%` }}>
            <StatusBar battery={batteryLevel} signal={signalStrength} carrier={carrierName} wifi={wifiEnabled} wifiStrength={wifiStrength} />

            {/* Android Widgets */}
            {theme === 'android' && (
                <div className="mt-12 px-6 flex flex-col gap-4 animate-fade-in">
                    <div className={`${isLight ? 'bg-black/10' : 'bg-white/10'} backdrop-blur-md rounded-2xl p-4 flex justify-between items-center ${isLight ? 'text-black' : 'text-white'} border ${isLight ? 'border-black/5' : 'border-white/5'} shadow-lg`}>
                        <div className="flex flex-col">
                            <span className="text-3xl font-light">6:34</span>
                            <span className="text-[10px] opacity-60">Tuesday, February 24</span>
                        </div>
                        <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-black/20' : 'bg-white/20'} flex items-center justify-center`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                        </div>
                    </div>
                </div>
            )}

            <div className={`grid grid-cols-4 gap-6 p-6 ${theme === 'ios' ? 'mt-12' : 'mt-4'} ${theme === 'android' ? 'gap-y-8' : ''}`}>
                {apps.map((type, i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center gap-1 animate-float-in cursor-pointer active:scale-95 transition-transform"
                        style={{ animationDelay: `${i * 0.05}s` }}
                        onClick={() => onOpenApp?.(type)}
                    >
                        <AppIcon type={type} theme={theme} style={iconStyle} />
                        <span className={`text-[9px] ${isLight ? 'text-black/80' : 'text-white/80'} font-medium capitalize mt-1`}>
                            {type}
                        </span>
                    </div>
                ))}
            </div>

            {/* Android Search Bar */}
            {theme === 'android' && (
                <div className={`absolute bottom-32 left-6 right-6 h-12 ${isLight ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-xl rounded-full flex items-center px-4 border ${isLight ? 'border-black/10' : 'border-white/10'} shadow-lg animate-slide-up`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-60"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                    <span className={`ml-3 ${isLight ? 'text-black/50' : 'text-white/50'} text-sm`}>Search...</span>
                </div>
            )}

            {/* Dock */}
            <div className={`absolute bottom-4 left-4 right-4 h-24 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-around px-2 border border-white/5 shadow-2xl animate-slide-up`}>
                <div className="cursor-pointer active:scale-90 transition-transform" onClick={() => onOpenApp?.('phone')}><AppIcon type="phone" theme={theme} style={iconStyle} /></div>
                <div className="cursor-pointer active:scale-90 transition-transform" onClick={() => onOpenApp?.('browser')}><AppIcon type="browser" theme={theme} style={iconStyle} /></div>
                <div className="cursor-pointer active:scale-90 transition-transform" onClick={() => onOpenApp?.('messages')}><AppIcon type="messages" theme={theme} style={iconStyle} /></div>
                <div className="cursor-pointer active:scale-90 transition-transform" onClick={() => onOpenApp?.('music')}><AppIcon type="music" theme={theme} style={iconStyle} /></div>
            </div>
        </div>
    );
}

