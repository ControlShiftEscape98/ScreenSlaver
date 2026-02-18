import type { DeviceType } from '../types';

// --- Assets / Placeholders ---
const WALLPAPER_IOS = 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)'; // default dark
const WALLPAPER_ANDROID = 'linear-gradient(135deg, #203A43 0%, #2C5364 100%)';

// --- Interfaces ---
interface SkinProps {
    deviceType: DeviceType;
    currentTime: Date;
    onUnlock?: () => void;
    batteryLevel?: number;
    signalStrength?: number;
}

function StatusBar({ battery = 100, signal = 4 }: { battery?: number, signal?: number }) {
    return (
        <div className="absolute top-0 left-0 right-0 px-6 py-2 flex justify-between items-center z-50">
            <div className="flex gap-1 items-end">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 rounded-sm ${i < signal ? 'bg-white' : 'bg-white/20'}`}
                        style={{ height: (i + 1) * 3 + 4 }}
                    />
                ))}
                <span className="text-[10px] font-bold ml-1 text-white opacity-80">Carrier</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-white opacity-80">{battery}%</span>
                <div className="w-5 h-2.5 border border-white/40 rounded-sm relative flex items-center p-[1px]">
                    <div className="h-full bg-white" style={{ width: `${battery}%` }} />
                    <div className="absolute -right-1 w-0.5 h-1 bg-white/40 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// --- iOS Lock Screen ---
export function IOSLockScreen({ currentTime, onUnlock, batteryLevel, signalStrength }: SkinProps) {
    return (
        <div className="w-full h-full flex flex-col items-center text-white relative animate-fade-in"
            style={{ background: WALLPAPER_IOS }}
            onClick={onUnlock}
        >
            <StatusBar battery={batteryLevel} signal={signalStrength} />
            <div className="mt-16 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M12 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h1 className="text-8xl font-thin tracking-tight">
                    {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
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
export function AndroidLockScreen({ currentTime, onUnlock, batteryLevel, signalStrength }: SkinProps) {
    return (
        <div className="w-full h-full flex flex-col pl-8 text-white relative animate-fade-in"
            style={{ background: WALLPAPER_ANDROID }}
            onClick={onUnlock}
        >
            <StatusBar battery={batteryLevel} signal={signalStrength} />
            <div className="mt-24 text-left">
                <h1 className="text-7xl font-normal leading-none text-[#B3E5FC]">
                    {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
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
export function IncomingCallSkin({ contactName = "Unknown", onAccept, onDecline }: { contactName?: string, onAccept: () => void, onDecline: () => void }) {
    return (
        <div className="w-full h-full bg-black/90 backdrop-blur-xl flex flex-col items-center pt-20 pb-20 text-white relative z-50 animate-slide-up">
            <div className="w-32 h-32 rounded-full bg-neutral-700 mb-6 flex items-center justify-center text-4xl font-bold text-neutral-400">
                {contactName[0]}
            </div>
            <h2 className="text-3xl font-bold mb-2">{contactName}</h2>
            <p className="text-neutral-400 mb-auto">mobile</p>

            <div className="w-full px-12 flex justify-between items-center">
                <button
                    onClick={onDecline}
                    className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.7-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.7.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" /></svg>
                </button>
                <button
                    onClick={onAccept}
                    className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 animate-pulse"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                </button>
            </div>
        </div>
    );
}

// --- Home Screen (Simple) ---
export function GenericHomeScreen({ theme = 'ios' }: { theme: 'ios' | 'android' }) {
    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: theme === 'ios' ? WALLPAPER_IOS : WALLPAPER_ANDROID }}>
            <div className={`grid grid-cols-4 gap-6 p-6 mt-12 ${theme === 'android' ? 'gap-y-8' : ''}`}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-14 h-14 ${theme === 'ios' ? 'rounded-xl' : 'rounded-full'} bg-white/20 backdrop-blur-md shadow-sm`} />
                        <div className="w-10 h-2 bg-white/30 rounded-full" />
                    </div>
                ))}
            </div>
            {/* Dock */}
            <div className="absolute bottom-4 left-4 right-4 h-24 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-around px-2">
                <div className={`w-14 h-14 ${theme === 'ios' ? 'rounded-xl' : 'rounded-full'} bg-green-500`} />
                <div className={`w-14 h-14 ${theme === 'ios' ? 'rounded-xl' : 'rounded-full'} bg-blue-500`} />
                <div className={`w-14 h-14 ${theme === 'ios' ? 'rounded-xl' : 'rounded-full'} bg-white`} />
                <div className={`w-14 h-14 ${theme === 'ios' ? 'rounded-xl' : 'rounded-full'} bg-red-500`} />
            </div>
        </div>
    );
}
