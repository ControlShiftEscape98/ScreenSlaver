import { useState, useEffect } from 'react';
import { useModeStore } from '../core/modeManager';
import { useAuthStore } from '../core/authManager';
import logoUrl from '../assets/logo.png'; // Import the new logo asset

const ASSISTANT_TIPS = [
    'Tips: Control every screen on set from one place.',
    'Quick Tools: Instant chroma screens — no session needed.',
    'Presets: Save device configs across shoots.',
    'Receiver Lock: Triple-tap to prevent touches.',
    'Cue Stack: Fire cues in sequence.',
];

export default function HomeScreen() {
    const { setMode } = useModeStore();
    const { user, signInWithGoogle, signOut } = useAuthStore();
    const [tipIndex, setTipIndex] = useState(0);
    const [showAssistant, setShowAssistant] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setTipIndex((i) => (i + 1) % ASSISTANT_TIPS.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden bg-surface-base">
            {/* Top Right Auth */}
            <div className="absolute top-6 right-6 z-50">
                {user ? (
                    <div className="flex items-center gap-3 bg-surface-200/50 backdrop-blur-md px-4 py-2 border border-white/5 rounded-full shadow-lg">
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-6 h-6 rounded-full border border-white/10" />
                        <span className="text-sm font-semibold text-white">{user.user_metadata.full_name}</span>
                        <button onClick={signOut} className="text-xs text-neutral-400 hover:text-red-400 font-bold ml-2 transition-colors">
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={signInWithGoogle}
                        className="flex items-center gap-2 bg-white text-surface-900 px-4 py-2 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in
                    </button>
                )}
            </div>

            {/* Background ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-accent-500/3 blur-3xl pointer-events-none" />

            {/* Logo & Title */}
            <div className="text-center mb-10 animate-float-in relative z-10">
                <div className="inline-flex items-center justify-center mb-5 animate-pulse-slow">
                    {/* Using the new asset logo as requested */}
                    <img
                        src={logoUrl}
                        alt="ScreenSlaver Logo"
                        className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Screen<span className="text-accent-500">Slaver</span>
                </h1>
                <p className="text-neutral-500 text-sm mt-1.5 font-medium tracking-wide">
                    Universal Digital Prop System
                </p>
            </div>

            {/* Mode Tiles */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl relative z-10 animate-float-in-delay-1">
                {/* Controller Tile */}
                <button
                    onClick={() => setMode('project-gateway')}
                    className="mode-tile text-left group"
                    id="btn-controller"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-4 group-hover:bg-accent-500/20 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
                            <line x1="4" y1="21" x2="4" y2="14" />
                            <line x1="4" y1="10" x2="4" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12" y2="3" />
                            <line x1="20" y1="21" x2="20" y2="16" />
                            <line x1="20" y1="12" x2="20" y2="3" />
                            <line x1="1" y1="14" x2="7" y2="14" />
                            <line x1="9" y1="8" x2="15" y2="8" />
                            <line x1="17" y1="16" x2="23" y2="16" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1">Controller</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        Manage all devices on set. Create presets, trigger cues, and orchestrate multi-device scenes.
                    </p>
                    <div className="flex items-center gap-1.5 mt-4 text-accent-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Enter Controller Mode
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                    </div>
                </button>

                {/* Receiver Tile */}
                <button
                    onClick={() => setMode('receiver')}
                    className="mode-tile text-left group"
                    id="btn-receiver"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-4 group-hover:bg-accent-500/20 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" />
                            <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1">Receiver</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        Turn this device into a prop. Full-screen display mode, locked controls, VFX-ready overlays.
                    </p>
                    <div className="flex items-center gap-1.5 mt-4 text-accent-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Enter Receiver Mode
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* Quick Tools Tile (Full Width) */}
            <div className="w-full max-w-xl mt-4 relative z-10 animate-float-in-delay-2">
                <button
                    onClick={() => setMode('quick-tools')}
                    className="mode-tile w-full flex items-center gap-5 text-left group"
                    id="btn-quick-tools"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-500/20 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83-2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-white">Quick Tools</h2>
                        <p className="text-neutral-400 text-sm">
                            Chroma screens, color charts, calibration grids & custom images — no session needed
                        </p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#f97316" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <path d="M4 10h12M12 6l4 4-4 4" />
                    </svg>
                </button>
            </div>

            {/* Assistant Widget - Floating Square */}
            {showAssistant && (
                <button
                    onClick={() => setTipIndex((i) => (i + 1) % ASSISTANT_TIPS.length)}
                    onContextMenu={(e) => { e.preventDefault(); setShowAssistant(false); }}
                    className="absolute top-8 left-8 w-[200px] h-[200px] glass-panel-elevated p-4 flex flex-col items-center justify-center text-center gap-3 animate-float-around hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer group"
                    style={{ animationDuration: '15s' }}
                    title="Tap for next tip, Right-click to close"
                >
                    <div className="w-10 h-10 rounded-full bg-accent-500/20 border border-accent-500/30 flex items-center justify-center animate-pulse-slow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <p className="text-xs text-white font-medium leading-tight line-clamp-3">
                        {ASSISTANT_TIPS[tipIndex]}
                    </p>
                    <div className="flex gap-1 mt-1">
                        {ASSISTANT_TIPS.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-1 rounded-full transition-colors ${i === tipIndex ? 'bg-accent-500' : 'bg-neutral-600'}`}
                            />
                        ))}
                    </div>
                    {/* Close X (hidden unless hover) */}
                    <div
                        onClick={(e) => { e.stopPropagation(); setShowAssistant(false); }}
                        className="absolute top-2 right-2 p-1 text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </button>
            )}

            {/* Footer */}
            <p className="absolute bottom-6 text-neutral-600 text-xs tracking-wider animate-float-in-delay-3">
                Designed for film & TV production crews
            </p>
        </div>
    );
}

// Inline this for now if needed, or rely on index.css
