import { useState, useEffect } from 'react';
import { useModeStore } from '../core/modeManager';
import type { QuickToolType, GridOverlayType } from '../types';
import { QuickToolRenderer, CHROMA_GREEN, CHROMA_BLUE, GRAY_18, GRAY_50, PURE_BLACK, PURE_WHITE } from './components/QuickToolRenderer';

type MarkerColor = 'white' | 'black' | 'red' | 'blue' | 'green' | 'yellow';

type ColorChartTab = 'color-chart' | 'color-chart-colorchecker' | 'color-chart-chromadumonde' | 'grayscale-wedge';

const COLOR_CHART_TABS: { key: ColorChartTab; label: string }[] = [
    { key: 'color-chart', label: 'Macbeth' },
    { key: 'color-chart-colorchecker', label: 'ColorChecker' },
    { key: 'color-chart-chromadumonde', label: 'ChromaDuMonde' },
    { key: 'grayscale-wedge', label: 'Grayscale' },
];

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
    const [selectedTool, setSelectedTool] = useState<QuickToolType | null>(null);
    const [activeChart, setActiveChart] = useState<ColorChartTab>('color-chart');
    const [isLocked, setIsLocked] = useState(false);
    const [tapCount, setTapCount] = useState(0);

    // Grid Settings
    const [gridOverlay, setGridOverlay] = useState<GridOverlayType>(null);
    const [markerColor, setMarkerColor] = useState<MarkerColor>('white');
    const [displayToolMarkers, setDisplayToolMarkers] = useState(false);
    const [showGridSettings, setShowGridSettings] = useState(false);

    // Custom Image state
    const [customImage, setCustomImage] = useState<string | null>(null);

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

    const isColorChart = (tool: QuickToolType | null): tool is ColorChartTab =>
        !!tool && ['color-chart', 'color-chart-colorchecker', 'color-chart-chromadumonde', 'grayscale-wedge'].includes(tool);

    // Resolve the actual rendered tool — if viewing chart mode, use the active tab
    const renderedTool: QuickToolType | null = isColorChart(selectedTool) ? activeChart : selectedTool;

    if (selectedTool) {
        const isSolidScreen = ['screen-green', 'screen-blue', 'screen-gray-18', 'screen-gray-50', 'black', 'white', 'calibration-grid'].includes(renderedTool || '');

        return (
            <div className="fixed inset-0 z-50 bg-black overflow-hidden" onClick={handleScreenClick}>
                <QuickToolRenderer
                    tool={renderedTool!}
                    gridOverlay={gridOverlay}
                    customImage={customImage}
                    markerColor={MARKER_COLORS[markerColor]}
                    displayToolMarkers={displayToolMarkers}
                />

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
                        {/* Grid Settings Toggle (Available on solid screens and calibration grid) */}
                        {isSolidScreen && (
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowGridSettings(!showGridSettings); }}
                                    className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg border border-white/10 flex items-center gap-2 ${showGridSettings ? 'bg-accent-500 text-white' : 'bg-black/50 text-white hover:bg-black/80'}`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3z" /><path d="M12 3v18" /><path d="M3 12h18" /></svg>
                                    <span className="text-xs font-bold uppercase hidden md:inline">Grid Guide</span>
                                </button>

                                {/* Settings Popover */}
                                {showGridSettings && (
                                    <div className="absolute top-14 right-0 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-float-in z-50 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                                        <div>
                                            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2 block">Tracking Markers</label>
                                            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                                <input
                                                    type="checkbox"
                                                    checked={displayToolMarkers}
                                                    onChange={e => setDisplayToolMarkers(e.target.checked)}
                                                    className="w-4 h-4 accent-accent-500 bg-surface-200 border border-white/20 rounded cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-white">Show Calibration Dots</span>
                                            </label>
                                        </div>
                                        <div className="h-px w-full bg-white/10" />
                                        <div>
                                            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2 block">Overlay Grid</label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {[
                                                    { value: null, label: 'None' },
                                                    { value: 'thirds' as GridOverlayType, label: 'Thirds' },
                                                    { value: 'golden-ratio' as GridOverlayType, label: 'Golden' },
                                                    { value: 'golden-spiral' as GridOverlayType, label: 'Spiral' },
                                                    { value: 'crosshair' as GridOverlayType, label: 'Cross' },
                                                ].map(opt => (
                                                    <button
                                                        key={opt.label}
                                                        onClick={() => setGridOverlay(opt.value)}
                                                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${gridOverlay === opt.value
                                                                ? 'bg-accent-500 text-white border-accent-400 shadow-glow-accent'
                                                                : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2 block">Overlay Color</label>
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

                {/* Bottom Tab Bar for Color Charts */}
                {isColorChart(selectedTool) && !isLocked && (
                    <div className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none" onClick={e => e.stopPropagation()}>
                        <div className="pointer-events-auto flex gap-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl">
                            {COLOR_CHART_TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveChart(tab.key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeChart === tab.key
                                            ? 'bg-accent-500 text-white shadow-glow-accent'
                                            : 'text-neutral-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- Main Selection Menu ---
    return (
        <div className="min-h-screen bg-surface-400 flex flex-col w-full">
            {/* Portrait Warning Overlay for Mobile */}
            <div className="fixed inset-0 z-[100] bg-surface-400 portrait-only flex-col items-center justify-center p-8 text-center animate-fade-in">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-500 mb-6 animate-pulse">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" transform="rotate(90 12 12)" />
                    <path d="M12 18h.01" />
                </svg>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Rotate Device</h2>
                <p className="text-neutral-400 font-medium text-sm">Quick Tools requires landscape orientation for precise rendering.</p>
                <button onClick={() => setMode('home')} className="mt-8 text-xs font-bold text-neutral-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Back to Home
                </button>
            </div>

            <div className="flex-1 p-6 portrait-hidden flex flex-col w-full max-w-6xl mx-auto overflow-y-auto" style={{ maxHeight: '100vh' }}>
                <header className="flex items-center justify-between mb-8 w-full">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMode('home')} className="p-3 hover:bg-surface-300 rounded-xl transition-all text-neutral-400 hover:text-white border border-transparent hover:border-white/10">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Quick Tools</h1>
                            <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider mt-0.5">Instant Callibration • Grids on Solids Included</p>
                        </div>
                    </div>
                </header>

                <div className="w-full flex flex-col gap-10 pb-20">

                    {/* Screens */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-accent-500 rounded-full" />
                            <h3 className="text-white text-sm font-bold uppercase tracking-widest">Chroma & Reference Screens</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                            <ToolCard
                                title="Pure Black"
                                subtitle="OLED Base"
                                color={PURE_BLACK}
                                onClick={() => setSelectedTool('black')}
                            />
                            <ToolCard
                                title="Pure White"
                                subtitle="100% Luma"
                                color={PURE_WHITE}
                                onClick={() => setSelectedTool('white')}
                            />
                        </div>
                    </section>

                    {/* Color Charts — Single Entry */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-accent-500 rounded-full" />
                            <h3 className="text-white text-sm font-bold uppercase tracking-widest">Industry Color Charts</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <ToolCard
                                title="Color Charts"
                                subtitle="Macbeth · Checker · ChromaDuMonde · Grayscale"
                                icon={<IconColorChart />}
                                onClick={() => {
                                    setActiveChart('color-chart');
                                    setSelectedTool('color-chart');
                                }}
                            />
                        </div>
                    </section>

                    {/* Tech & Custom */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-accent-500 rounded-full" />
                            <h3 className="text-white text-sm font-bold uppercase tracking-widest">Technical & Custom</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                                    setGridOverlay(null);
                                    setMarkerColor('white');
                                    setSelectedTool('calibration-grid');
                                }}
                            />
                            <ToolCard
                                title="Custom Image"
                                subtitle="From Device"
                                icon={<IconImage />}
                                onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = ev => {
                                                setCustomImage(ev.target?.result as string);
                                                setSelectedTool('custom-image');
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    };
                                    input.click();
                                }}
                            />
                        </div>
                    </section>
                </div>
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
            <div className="h-24 rounded-xl mb-4 w-full relative overflow-hidden flex items-center justify-center bg-surface-300 border border-white/5 shadow-inner">
                {color !== undefined && <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: color }} />}
                {icon && <div className="text-neutral-500 group-hover:text-white transition-all transform group-hover:scale-110 duration-300 group-hover:rotate-3">{icon}</div>}
            </div>
            <h4 className="text-white font-bold tracking-tight group-hover:text-accent-500 transition-colors text-sm">{title}</h4>
            <p className="text-neutral-500 text-xs font-medium">{subtitle}</p>
        </button>
    );
}

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
