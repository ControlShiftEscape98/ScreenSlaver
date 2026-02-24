import type { QuickToolType, GridOverlayType } from '../../types';

// Industry Standard Colors
export const CHROMA_GREEN = '#00E34F'; // Digital Green
export const CHROMA_BLUE = '#1050FF';  // Chroma Blue
export const GRAY_18 = '#333333';      // 18% Linear approx
export const GRAY_50 = '#909090';      // 50% approx
export const PURE_BLACK = '#000000';
export const PURE_WHITE = '#FFFFFF';

// Color Chart Data (Macbeth-ish approximation)
const COLOR_CHART_MACBETH = [
    ['#735244', '#c29682', '#627a9d', '#576c43', '#8580b1', '#67bdaa'], // Row 1
    ['#d67e2c', '#505ba6', '#c15a63', '#5e3c6c', '#9dbc40', '#e0a32e'], // Row 2
    ['#383d96', '#469449', '#af363c', '#e7c71f', '#bb5695', '#0885a1'], // Row 3
    ['#ffffff', '#e8e8e8', '#a0a0a0', '#777777', '#3a3a3a', '#050505'], // Row 4
];

// X-Rite ColorChecker Video (approximate 24 patch standard)
const COLOR_CHART_COLORCHECKER = [
    // Chromatic colors
    ['#f9e169', '#f3a921', '#db6536', '#c73347', '#97245b', '#482061'],
    ['#1d599c', '#0079b7', '#25906d', '#509e45', '#9ab73d', '#bc9c6d'],
    // Skin tones & Grayscale
    ['#eec8b3', '#d5a18a', '#aa745a', '#6f4534', '#ffffff', '#000000'],
    ['#e1e1e1', '#b4b4b4', '#858585', '#575757', '#343434', '#151515'],
];

// Grayscale Wedge (11 steps)
const GRAYSCALE_WEDGE = [
    '#ffffff', '#e6e6e6', '#cccccc', '#b3b3b3', '#999999', '#808080',
    '#666666', '#4d4d4d', '#333333', '#1a1a1a', '#000000'
];

// SMPTE Bar approximate colors (standard 75% bars)
const SMPTE_BARS = [
    '#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'
];

interface QuickToolRendererProps {
    tool: QuickToolType;
    gridOverlay?: GridOverlayType;
    customImage?: string | null;
    markerColor?: string; // used for generic grids e.g. crosshair on black
    displayToolMarkers?: boolean | null;
}

export function QuickToolRenderer({ tool, gridOverlay, customImage, markerColor = 'rgba(255,255,255,0.7)', displayToolMarkers }: QuickToolRendererProps) {
    if (!tool) return null;

    // Helper: Determine Background Color for Solid Screens
    const getBgColor = () => {
        switch (tool) {
            case 'screen-green': return CHROMA_GREEN;
            case 'screen-blue': return CHROMA_BLUE;
            case 'screen-gray-18': return GRAY_18;
            case 'screen-gray-50': return GRAY_50;
            case 'black': return PURE_BLACK;
            case 'white': return PURE_WHITE;
            default: return 'transparent';
        }
    };

    // Helper: Grid Overlay CSS
    const getGridOverlayStyle = (): React.CSSProperties => {
        if (!gridOverlay) return {};

        const c = markerColor; // overlay color

        switch (gridOverlay) {
            case 'thirds':
                return {
                    backgroundImage: `
                        linear-gradient(to right, transparent 33.33%, ${c} 33.33%, ${c} calc(33.33% + 1px), transparent calc(33.33% + 1px), transparent 66.66%, ${c} 66.66%, ${c} calc(66.66% + 1px), transparent calc(66.66% + 1px)),
                        linear-gradient(to bottom, transparent 33.33%, ${c} 33.33%, ${c} calc(33.33% + 1px), transparent calc(33.33% + 1px), transparent 66.66%, ${c} 66.66%, ${c} calc(66.66% + 1px), transparent calc(66.66% + 1px))
                    `,
                };
            case 'golden-ratio':
                return {
                    // Phi Grid (approx 38.2% and 61.8%)
                    backgroundImage: `
                        linear-gradient(to right, transparent 38.2%, ${c} 38.2%, ${c} calc(38.2% + 1px), transparent calc(38.2% + 1px), transparent 61.8%, ${c} 61.8%, ${c} calc(61.8% + 1px), transparent calc(61.8% + 1px)),
                        linear-gradient(to bottom, transparent 38.2%, ${c} 38.2%, ${c} calc(38.2% + 1px), transparent calc(38.2% + 1px), transparent 61.8%, ${c} 61.8%, ${c} calc(61.8% + 1px), transparent calc(61.8% + 1px))
                    `,
                };
            case 'crosshair':
                return {
                    backgroundImage: `
                        linear-gradient(to right, transparent calc(50% - 0.5px), ${c} calc(50% - 0.5px), ${c} calc(50% + 0.5px), transparent calc(50% + 0.5px)),
                        linear-gradient(to bottom, transparent calc(50% - 0.5px), ${c} calc(50% - 0.5px), ${c} calc(50% + 0.5px), transparent calc(50% + 0.5px))
                    `,
                };
            case 'golden-spiral':
                return {
                    // Represents the Fibonacci spiral conceptually
                    // Displaying complex curves purely with CSS borders in a single div is mostly decorative approximations, 
                    // a true SVG is best, but we'll approximate a main shell structure with CSS gradients and border radiuses.
                    // For now, simpler grid approximation to guide the eye.
                    backgroundImage: `
                        linear-gradient(to bottom, transparent 61.8%, ${c} 61.8%, ${c} calc(61.8% + 1px), transparent calc(61.8% + 1px)),
                        linear-gradient(to right, transparent 61.8%, ${c} 61.8%, ${c} calc(61.8% + 1px), transparent calc(61.8% + 1px))
                    `,
                };
            default:
                return {};
        }
    };

    const isSolidScreen = [
        'screen-green', 'screen-blue', 'screen-gray-18', 'screen-gray-50', 'black', 'white'
    ].includes(tool);

    if (isSolidScreen) {
        return (
            <div className="w-full h-full relative" style={{ backgroundColor: getBgColor() }}>
                {displayToolMarkers && (
                    <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: `
                            linear-gradient(${markerColor} 1px, transparent 1px),
                            linear-gradient(90deg, ${markerColor} 1px, transparent 1px)
                        `,
                        backgroundSize: '100px 100px',
                        backgroundPosition: 'center center'
                    }} />
                )}
                {gridOverlay && (
                    <div className="absolute inset-0 pointer-events-none" style={getGridOverlayStyle()} />
                )}
            </div>
        );
    }


    if (tool === 'color-chart') {
        return (
            <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center p-4">
                <div className="aspect-[6/4] w-full max-w-5xl grid grid-rows-4 gap-1 sm:gap-2 bg-black border-4 border-black p-1 sm:p-2 shadow-2xl">
                    {COLOR_CHART_MACBETH.map((row, rIdx) => (
                        <div key={rIdx} className="grid grid-cols-6 gap-1 sm:gap-2">
                            {row.map((color, cIdx) => (
                                <div key={cIdx} className="w-full h-full shadow-inner border border-white/5" style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (tool === 'color-chart-colorchecker') {
        return (
            <div className="w-full h-full bg-[#333333] flex items-center justify-center p-4">
                <div className="aspect-[6/4] w-full max-w-5xl grid grid-rows-4 gap-1 sm:gap-2 bg-[#222222] border-4 border-[#222222] p-1 sm:p-2 shadow-2xl">
                    {COLOR_CHART_COLORCHECKER.map((row, rIdx) => (
                        <div key={rIdx} className="grid grid-cols-6 gap-1 sm:gap-2">
                            {row.map((color, cIdx) => (
                                <div key={cIdx} className="w-full h-full shadow-inner border border-white/10" style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (tool === 'color-chart-chromadumonde') {
        // Approximate vector/circular target layout of the ChromaDuMonde using CSS grids
        return (
            <div className="w-full h-full bg-[#111111] flex items-center justify-center p-4">
                <div className="relative aspect-video w-full max-w-5xl bg-[#333333] border-[10px] border-black p-4 shadow-2xl flex items-center justify-center overflow-hidden">
                    {/* Corner register marks */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white" />

                    {/* Circular pattern approximation */}
                    <div className="grid grid-cols-6 grid-rows-4 w-full h-full gap-2 p-10 relative">
                        {/* Background center grid */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2/3 h-2/3 border border-white/20 rounded-full flex flex-col items-center justify-center space-y-2">
                                {/* Extended skin tones cluster in the center */}
                                <div className="flex gap-2"><div className="w-12 h-8 bg-[#d69f80]" /><div className="w-12 h-8 bg-[#ad6d51]" /></div>
                                <div className="flex gap-2"><div className="w-12 h-8 bg-[#f5d6c6]" /><div className="w-12 h-8 bg-[#4a2e23]" /></div>
                            </div>
                        </div>
                        {/* Colors around the edge (Vibrant primaries) */}
                        {COLOR_CHART_MACBETH.flat().map((color, i) => (
                            <div key={i} className={`w-full h-full rounded shadow-inner border border-black/50 ${i > 7 && i < 16 ? 'opacity-0' : ''}`} style={{ backgroundColor: color }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (tool === 'grayscale-wedge') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black p-10">
                <div className="w-full max-w-7xl flex h-1/2 border border-white/20 shadow-2xl">
                    {GRAYSCALE_WEDGE.map((color, i) => (
                        <div key={i} className="flex-1 h-full flex flex-col justify-end" style={{ backgroundColor: color }}>
                            <div className={`w-full text-center pb-2 text-xs font-mono font-bold ${i < 5 ? 'text-black' : 'text-white'} opacity-50`}>
                                {(i * 10)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (tool === 'smpte-bars') {
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
    }

    if (tool === 'custom-image') {
        return (
            <div className="w-full h-full bg-black flex items-center justify-center relative">
                {customImage ? (
                    <img src={customImage} alt="Custom" className="w-full h-full object-contain" />
                ) : (
                    <div className="text-neutral-500 font-mono text-xs border border-dashed border-white/20 p-10 rounded-xl">
                        Awaiting Custom Image (Upload via Controller Dashboard)
                    </div>
                )}
            </div>
        );
    }

    return null;
}
