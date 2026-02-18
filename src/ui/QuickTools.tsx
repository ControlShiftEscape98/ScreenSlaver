import { useState, useEffect } from 'react';
import { useModeStore } from '../core/modeManager';

// Industry Standard Colors (Boosted Saturation for User Preference)
const CHROMA_GREEN = '#00E34F'; // "Super Bright" Digital Green
const CHROMA_BLUE = '#1050FF';  // Vibrant Chroma Blue
const GRAY_18 = '#333333';      // Visually Darker Gray (18% Linear approx)
const GRAY_50 = '#909090';      // Visually Lighter Middle Gray

// Color Chart Data (Macbeth-ish approximation)
const COLOR_CHART = [
    ['#735244', '#c29682', '#627a9d', '#576c43', '#8580b1', '#67bdaa'], // Row 1
    ['#d67e2c', '#505ba6', '#c15a63', '#5e3c6c', '#9dbc40', '#e0a32e'], // Row 2
    ['#383d96', '#469449', '#af363c', '#e7c71f', '#bb5695', '#0885a1'], // Row 3
    ['#ffffff', '#e8e8e8', '#a0a0a0', '#777777', '#3a3a3a', '#050505'], // Row 4
];

// SMPTE Bar approximate colors (standard 75% bars)
const SMPTE_BARS = [
    '#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'
];

type ToolType = 'screen-green' | 'screen-blue' | 'screen-gray-18' | 'screen-gray-50' | 'color-chart' | 'smpte-bars' | 'grid' | 'custom-image';
type MarkerStyle = 'cross' | 'dot';
type MarkerColor = 'white' | 'black' | 'red' | 'blue' | 'green' | 'yellow';

const MARKER_COLORS: Record<MarkerColor, string> = {
    white: 'rgba(255, 255, 255, 0.8)',
    black: 'rgba(0, 0, 0, 0.8)',
    red: 'rgba(255, 0, 0, 0.8)',
    blue: 'rgba(0, 0, 255, 0.8)',
    green: 'rgba(0, 227, 79, 0.8)',
    yellow: 'rgba(255, 255, 0, 0.8)',
};

export default function QuickTools() {
    const { setMode } = useModeStore();
    const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [tapCount, setTapCount] = useState(0);

    // Grid Settings
    const [markerStyle, setMarkerStyle] = useState<MarkerStyle>('cross');
    const [markerColor, setMarkerColor] = useState<MarkerColor>('white');
    const [showGridSettings, setShowGridSettings] = useState(false);

    // --- Screen Lock Logic (Triple Tap) ---
    useEffect(() => {
        if (!isLocked) {
            setTapCount(0);
            return;
        }
        let timer: ReturnType<typeof setTimeout>;
        if (tapCount > 0) {
            timer = setTimeout(() => setTapCount(0), 400);
        }
        if (tapCount >= 3) {
            setIsLocked(false);
            setTapCount(0);
        }
        return () => clearTimeout(timer);
    }, [tapCount, isLocked]);

    const handleScreenClick = () => {
        if (isLocked) {
            setTapCount(prev => prev + 1);
        }
    };

    // --- Styles for Grids ---
    const getGridStyle = () => {
        const color = MARKER_COLORS[markerColor];

        if (markerStyle === 'cross') {
            return {
                backgroundImage: `
                    linear-gradient(${color} 1px, transparent 1px),
                    linear-gradient(90deg, ${color} 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
                backgroundPosition: 'center center'
            };
        } else {
            return {
                backgroundImage: `radial-gradient(circle, ${color} 2px, transparent 2.5px)`,
                backgroundSize: '50px 50px',
                backgroundPosition: 'center center'
            };
        }
    };

    // --- Render Fullscreen Tool ---
    const renderToolContent = () => {
        switch (selectedTool) {
            case 'screen-green':
                return <div className="w-full h-full" style={{ backgroundColor: CHROMA_GREEN }} />;
            case 'screen-blue':
                return <div className="w-full h-full" style={{ backgroundColor: CHROMA_BLUE }} />;
            case 'screen-gray-18':
                return <div className="w-full h-full" style={{ backgroundColor: GRAY_18 }} />;
            case 'screen-gray-50':
                return <div className="w-full h-full" style={{ backgroundColor: GRAY_50 }} />;
            case 'grid':
                return (
                    <div className={`w-full h-full relative overflow-hidden ${markerColor === 'black' ? 'bg-white' : 'bg-black'}`}>
                        {/* The Grid/Markers */}
                        <div className="absolute inset-0" style={getGridStyle()} />

                        {/* Center Label (Optional) */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-mono opacity-50 ${markerColor === 'black' ? 'text-black' : 'text-white'}`}>
                            {markerStyle.toUpperCase()} GRID
                        </div>
                    </div>
                );
            case 'color-chart':
                return (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center p-4 md:p-10">
                        <div className="aspect-[6/4] w-full max-w-5xl grid grid-rows-4 gap-1 sm:gap-2 bg-black border-4 border-black p-1 sm:p-2 shadow-2xl">
                            {COLOR_CHART.map((row, rIdx) => (
                                <div key={rIdx} className="grid grid-cols-6 gap-1 sm:gap-2">
                                    {row.map((color, cIdx) => (
                                        <div key={cIdx} className="w-full h-full shadow-inner" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'smpte-bars':
                return (
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-1 flex">
                            {SMPTE_BARS.map((color, i) => (
                                <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }} />
                            ))}
                        </div>
                        <div className="h-1/4 flex">
                            <div className="w-[14.28%] bg-[#001d4a]" />
                            <div className="w-[14.28%] bg-[#ffffff]" />
                            <div className="w-[14.28%] bg-[#32006a]" />
                            <div className="w-[14.28%] bg-[#1a1a1a]" />
                            <div className="w-[14.28%] bg-[#0a0a0a]" />
                            <div className="w-[14.28%] bg-[#1a1a1a]" />
                            <div className="w-[14.28%] bg-[#1a1a1a]" />
                        </div>
                    </div>
                );
            case 'custom-image':
                return (
                    <div className="w-full h-full bg-black flex items-center justify-center text-neutral-500">
                        Drag & Drop Image (Placeholder)
                    </div>
                );
            default:
                return null;
        }
    };

    if (selectedTool) {
        return (
            <div className="fixed inset-0 z-50 bg-black overflow-hidden" onClick={handleScreenClick}>
                {renderToolContent()}

                {/* Controls Overlay */}
                <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-start transition-all duration-300 z-50 ${isLocked ? 'opacity-0 hover:opacity-100 pointer-events-none hover:pointer-events-auto' : 'opacity-100'}`}>
                    {/* Back Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedTool(null); }}
                        className="bg-black/50 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-black/80 hover:scale-105 transition-all shadow-lg border border-white/10"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>

                    <div className="flex gap-3">
                        {/* Grid Settings Toggle (Only for Grid Tool) */}
                        {selectedTool === 'grid' && (
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowGridSettings(!showGridSettings); }}
                                    className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg border border-white/10 flex items-center gap-2 ${showGridSettings ? 'bg-accent-500 text-white' : 'bg-black/50 text-white hover:bg-black/80'}`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                                    <span className="text-xs font-bold uppercase hidden md:inline">Options</span>
                                </button>

                                {/* Settings Popover */}
                                {showGridSettings && (
                                    <div className="absolute top-14 right-0 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-float-in z-50" onClick={e => e.stopPropagation()}>
                                        <div className="mb-4">
                                            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2 block">Marker Style</label>
                                            <div className="flex bg-white/10 rounded-lg p-1">
                                                <button onClick={() => setMarkerStyle('cross')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${markerStyle === 'cross' ? 'bg-accent-500 text-white' : 'text-neutral-400 hover:text-white'}`}>CROSS</button>
                                                <button onClick={() => setMarkerStyle('dot')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${markerStyle === 'dot' ? 'bg-accent-500 text-white' : 'text-neutral-400 hover:text-white'}`}>DOT</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2 block">Marker Color</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(Object.keys(MARKER_COLORS) as MarkerColor[]).map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setMarkerColor(c)}
                                                        className={`h-8 rounded-lg border-2 transition-all ${markerColor === c ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                                        style={{ backgroundColor: MARKER_COLORS[c] }}
                                                        title={c}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Lock Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsLocked(!isLocked); }}
                            className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg border border-white/10 ${isLocked ? 'bg-red-500 text-white animate-pulse' : 'bg-black/50 text-white hover:bg-black/80 hover:scale-105'}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {isLocked ? <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /> : <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />}
                                <path d={isLocked ? "M7 11V7a5 5 0 0 1 10 0v4" : "M7 11V7a5 5 0 0 1 9.9-1"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {isLocked && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono bg-black/60 backdrop-blur-md px-4 py-2 rounded-full uppercase tracking-widest border border-white/10 pointer-events-none animate-fade-in">
                        Triple-tap to unlock
                    </div>
                )}
            </div>
        );
    }

    // --- Main Selection Menu ---
    return (
        <div className="min-h-screen bg-surface-400 p-6 flex flex-col">
            <header className="flex items-center justify-between mb-8 max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <button onClick={() => setMode('home')} className="p-3 hover:bg-surface-300 rounded-xl transition-all text-neutral-400 hover:text-white border border-transparent hover:border-white/10">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Quick Tools</h1>
                        <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider mt-0.5">Instant Calibration • No Session Required</p>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">

                {/* Screens */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 bg-accent-500 rounded-full" />
                        <h3 className="text-white text-sm font-bold uppercase tracking-widest">Chroma & Screens</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <ToolCard
                            title="Digital Green"
                            subtitle="Vibrant Chroma"
                            color={CHROMA_GREEN}
                            onClick={() => setSelectedTool('screen-green')}
                        />
                        <ToolCard
                            title="Chroma Blue"
                            subtitle="Vibrant Chroma"
                            color={CHROMA_BLUE}
                            onClick={() => setSelectedTool('screen-blue')}
                        />
                        <ToolCard
                            title="Dark Gray"
                            subtitle="18% Reference"
                            color={GRAY_18}
                            onClick={() => setSelectedTool('screen-gray-18')}
                        />
                        <ToolCard
                            title="Light Gray"
                            subtitle="50% Reference"
                            color={GRAY_50}
                            onClick={() => setSelectedTool('screen-gray-50')}
                        />
                    </div>
                </section>

                {/* Charts & Grids */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 bg-accent-500 rounded-full" />
                        <h3 className="text-white text-sm font-bold uppercase tracking-widest">Charts & Grids</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <ToolCard
                            title="Color Chart"
                            subtitle="Macbeth Style"
                            icon={<IconColorChart />}
                            onClick={() => setSelectedTool('color-chart')}
                        />
                        <ToolCard
                            title="SMPTE Bars"
                            subtitle="HD Standard"
                            icon={<IconSMPTE />}
                            onClick={() => setSelectedTool('smpte-bars')}
                        />
                        <ToolCard
                            title="Calibration Grid"
                            subtitle="Custom Markers"
                            icon={<IconGridCross />}
                            onClick={() => {
                                // Default to cross/white
                                setMarkerStyle('cross');
                                setMarkerColor('white');
                                setSelectedTool('grid');
                            }}
                        />
                        <ToolCard
                            title="Custom Image"
                            subtitle="From Device"
                            icon={<IconImage />}
                            onClick={() => setSelectedTool('custom-image')}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

function ToolCard({ title, subtitle, color, icon, onClick }: { title: string, subtitle: string, color?: string, icon?: React.ReactNode, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="group glass-panel p-4 text-left hover:border-accent-500/50 hover:shadow-glow-accent transition-all duration-300 active:scale-[0.98] relative overflow-hidden"
        >
            <div className="h-28 rounded-xl mb-4 w-full relative overflow-hidden flex items-center justify-center bg-surface-300 border border-white/5 shadow-inner">
                {color && <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: color }} />}
                {icon && <div className="text-neutral-500 group-hover:text-white transition-all transform group-hover:scale-110 duration-300 group-hover:rotate-3">{icon}</div>}
            </div>
            <h4 className="text-white font-bold tracking-tight group-hover:text-accent-500 transition-colors">{title}</h4>
            <p className="text-neutral-500 text-xs font-medium">{subtitle}</p>
        </button>
    );
}

// Simple internal generic icons for the cards
const IconImage = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const IconColorChart = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
);

const IconSMPTE = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="6" y1="4" x2="6" y2="20" />
        <line x1="10" y1="4" x2="10" y2="20" />
        <line x1="14" y1="4" x2="14" y2="20" />
        <line x1="18" y1="4" x2="18" y2="20" />
    </svg>
);

const IconGridCross = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
    </svg>
);

const IconGridDot = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="16" cy="8" r="1.5" />
        <circle cx="8" cy="16" r="1.5" />
        <circle cx="16" cy="16" r="1.5" />
    </svg>
);
