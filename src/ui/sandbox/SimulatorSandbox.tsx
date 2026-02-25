import { useState, useEffect, useRef } from 'react';
import {
    GenericHomeScreen,
    IncomingCallSkin,
    TerminalSkin
} from '../ReceiverComponents';
import { toggleFullscreen } from '../../utils/fullscreen';

/**
 * SimulatorSandbox
 * A playground for the "Universal Simulator Engine" logic.
 * Detects hardware and applies virtual bezels for non-mobile devices.
 */
export default function SimulatorSandbox() {
    const [hwType, setHwType] = useState<'phone' | 'tablet' | 'laptop' | 'monitor'>('phone');
    const [isCinematic, setIsCinematic] = useState(false);
    const [testMode, setTestMode] = useState<'home' | 'call' | 'terminal'>('home');
    const [tapCount, setTapCount] = useState(0);
    const tapRef = useRef(0);
    const lastTapRef = useRef(0);
    const [showFullscreenToast, setShowFullscreenToast] = useState(false);

    // Hardware Detection Logic
    useEffect(() => {
        const ua = navigator.userAgent;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const maxDim = Math.max(width, height);

        let detected: 'phone' | 'tablet' | 'laptop' | 'monitor' = 'phone';

        if (/iPad|Android|webOS/i.test(ua)) {
            if (maxDim > 1024) detected = 'tablet';
            else detected = 'phone';
        } else if (/Macintosh|Windows|Linux/i.test(ua)) {
            if (width > 2000) detected = 'monitor';
            else detected = 'laptop';
        }

        setHwType(detected);
    }, []);



    // --- Screen Reset Logic (Timing context for UI) ---
    useEffect(() => {
        const timer = setTimeout(() => setTapCount(0), 1000);
        return () => clearTimeout(timer);
    }, [tapCount]);

    const handleGlobalClick = () => {
        const now = Date.now();
        if (now - lastTapRef.current < 1000) {
            tapRef.current += 1;
        } else {
            tapRef.current = 1;
        }
        lastTapRef.current = now;

        // Sync state for UI feedback
        setTapCount(tapRef.current);

        if (tapRef.current >= 3) {
            console.log("[ScreenSlaver] Sandbox Gesture: Triple-tap detected. Requesting Fullscreen.");
            toggleFullscreen(); // Direct Execution!
            setShowFullscreenToast(true);
            setTimeout(() => setShowFullscreenToast(false), 2000);
            tapRef.current = 0;
            setTapCount(0);
        }
    };

    const renderContent = () => {
        const commonProps = {
            batteryLevel: 85,
            signalStrength: 4,
            carrierName: 'Sandbox',
            wifiEnabled: true,
            wifiStrength: 3,
            simTime: '12:00',
            fontScale: hwType === 'laptop' || hwType === 'monitor' ? 1.5 : 1.0 // Scale up for large screens
        };

        switch (testMode) {
            case 'call':
                return (
                    <div className="w-full h-full bg-black">
                        <IncomingCallSkin
                            {...commonProps}
                            contactName="Director"
                            phoneNumber="555-0199"
                            onAccept={() => setTestMode('home')}
                            onDecline={() => setTestMode('home')}
                        />
                    </div>
                );
            case 'terminal':
                return (
                    <div className="w-full h-full bg-black">
                        <TerminalSkin
                            {...commonProps}
                            terminalCode="sandbox.init()\nloading modules...\nready."
                        />
                    </div>
                );
            default:
                return (
                    <div className="w-full h-full bg-black">
                        <GenericHomeScreen
                            {...commonProps}
                            theme="ios"
                            onOpenApp={() => { }}
                        />
                    </div>
                );
        }
    };

    return (
        <div
            onClick={handleGlobalClick}
            className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden font-sans text-white"
        >
            {/* Global Fullscreen Toast */}
            {showFullscreenToast && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-2xl px-8 py-4 rounded-3xl border border-white/20 shadow-2xl z-[1000] animate-float-in flex flex-col items-center gap-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center border border-accent-500/50">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent-500">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    </div>
                    <p className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Takeover Mode Requested</p>
                </div>
            )}
            {/* Background Texture (Subtle grid) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />

            {/* Header / Controls */}
            {!isCinematic && (
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl cursor-auto">
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase italic text-accent-500">Universal Simulator Engine</h1>
                        <p className="text-[10px] font-mono text-neutral-500">Zero-Frame Mode &bull; <span className="text-white uppercase">{hwType}</span> detected</p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex bg-surface-300 p-1 rounded-xl border border-white/5">
                            <button onClick={(e) => { e.stopPropagation(); setTestMode('home'); }} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${testMode === 'home' ? 'bg-accent-500 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}>Home</button>
                            <button onClick={(e) => { e.stopPropagation(); setTestMode('call'); }} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${testMode === 'call' ? 'bg-accent-500 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}>Call</button>
                            <button onClick={(e) => { e.stopPropagation(); setTestMode('terminal'); }} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${testMode === 'terminal' ? 'bg-accent-500 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}>Terminal</button>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen();
                                setShowFullscreenToast(true);
                                setTimeout(() => setShowFullscreenToast(false), 2000);
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/10 text-[10px] uppercase font-black tracking-widest transition-all"
                        >
                            Toggle Fullscreen
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); setIsCinematic(true); }}
                            className="bg-accent-500/10 hover:bg-accent-500/30 text-accent-500 px-4 py-2 rounded-xl border border-accent-500/30 text-[10px] uppercase font-black tracking-widest transition-all"
                        >
                            Cinematic Mode
                        </button>
                    </div>
                </div>
            )}

            {/* The Fullscreen Content Wrapper */}
            <div className="w-full h-full relative z-10 transition-transform duration-1000 ease-in-out">
                {renderContent()}
            </div>

            {/* Footer Status */}
            {!isCinematic && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center space-y-2 opacity-40 z-50">
                    <p className="text-[10px] font-mono tracking-widest uppercase">Prop Honesty Module v2.0 &bull; 4-Tap for Fullscreen</p>
                    <div className="flex gap-2 justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                    </div>
                </div>
            )}

            {/* Exit Cinematic Mode Hint */}
            {isCinematic && (
                <button
                    onClick={(e) => { e.stopPropagation(); setIsCinematic(false); }}
                    className="absolute top-6 right-6 z-[100] opacity-0 hover:opacity-100 transition-opacity bg-black/50 text-white/50 px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-tighter cursor-auto"
                >
                    Exit Cinematic (Esc)
                </button>
            )}
        </div>
    );
}
