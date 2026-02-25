import { useState, useEffect } from 'react';
import type { ScreenUnit, DeviceState } from '../../types';
import { useSessionStore } from '../../core/sessionManager';

interface EditDevicePanelProps {
    device: ScreenUnit;
    onClose: () => void;
}

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-white/5 rounded-xl bg-surface-300 overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-surface-200 hover:bg-surface-100 transition-colors cursor-pointer"
            >
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{title}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 bg-surface-300 border-t border-white/5 animate-fade-in flex flex-col gap-4">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function EditDevicePanel({ device, onClose }: EditDevicePanelProps) {
    const { updateDeviceState } = useSessionStore();
    const [localState, setLocalState] = useState<DeviceState>(device.currentState);

    // Update local state when device prop changes
    useEffect(() => {
        setLocalState(device.currentState);
    }, [device.currentState]);

    const handleChange = <K extends keyof DeviceState>(key: K, value: DeviceState[K]) => {
        const newState = { ...localState, [key]: value };
        setLocalState(newState);
        updateDeviceState(device.id, { [key]: value });
    };

    return (
        <div className="w-[340px] border-l border-white/5 bg-surface-400 flex flex-col shadow-2xl z-40 animate-slide-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-accent-500/20 bg-surface-200">
                <div className="flex-1">
                    <h2 className="text-sm font-bold text-white tracking-wide uppercase">Edit Device</h2>
                    <p className="text-[10px] text-accent-500 font-bold">{device.name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            updateDeviceState(device.id, { identifying: true });
                            setTimeout(() => updateDeviceState(device.id, { identifying: false }), 2000);
                        }}
                        className="px-3 py-1 bg-accent-500/20 text-accent-500 border border-accent-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-accent-500/30 transition-all"
                    >
                        Identify
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-surface-base">

                <CollapsibleSection title="View Mode" defaultOpen={true}>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'lock', label: 'Lock Screen' },
                            { id: 'home', label: 'Home Screen' },
                            { id: 'call', label: 'Incoming Call' },
                            { id: 'keyboard', label: 'Virtual Keyboard' },
                        ].map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => handleChange('currentApp', mode.id as any)}
                                className={`py-2 px-3 text-[11px] font-bold rounded-lg border transition-all text-center
                                    ${localState.currentApp === mode.id
                                        ? 'bg-accent-500 border-accent-500 text-white shadow-glow-accent'
                                        : 'bg-surface-200 border-white/5 text-neutral-400 hover:text-white hover:bg-surface-100'
                                    }`}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Visual Theme">
                    {/* 1. OS Style */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">OS Style</label>
                        <div className="flex bg-surface-200 p-1 rounded-xl border border-white/5">
                            <button
                                onClick={() => handleChange('skin', 'ios')}
                                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${localState.skin === 'ios' ? 'bg-surface-100 text-white border border-white/5 shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                            >
                                iOS Style
                            </button>
                            <button
                                onClick={() => handleChange('skin', 'android')}
                                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${localState.skin === 'android' ? 'bg-surface-100 text-white border border-white/5 shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                            >
                                Android Style
                            </button>
                        </div>
                    </div>

                    {/* 2. Theme Mode */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Theme Mode</label>
                        <div className="flex bg-surface-200 p-1 rounded-xl border border-white/5">
                            <button
                                onClick={() => handleChange('themeMode', 'dark')}
                                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${localState.themeMode === 'dark' ? 'bg-surface-100 text-white border border-white/5 shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                            >
                                Dark Mode
                            </button>
                            <button
                                onClick={() => handleChange('themeMode', 'light')}
                                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${localState.themeMode === 'light' ? 'bg-surface-100 text-white border border-white/5 shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                            >
                                Light Mode
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* 3. Theme Color */}
                        <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">System Accent</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={localState.themeColor || '#0ea5e9'}
                                    onChange={e => handleChange('themeColor', e.target.value)}
                                    className="w-8 h-8 rounded-md cursor-pointer border border-white/10 bg-surface-100 p-0.5 shadow-inner"
                                />
                                <span className="text-xs font-mono text-neutral-400 uppercase">{localState.themeColor || '#0ea5e9'}</span>
                            </div>
                        </div>

                        {/* 4. Wallpaper */}
                        <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Wallpaper</label>
                            <select
                                value={localState.wallpaper || 'default'}
                                onChange={(e) => handleChange('wallpaper', e.target.value)}
                                className="w-full bg-surface-200 border border-white/5 rounded-lg p-2 text-xs text-white outline-none hover:border-accent-500/50 focus:border-accent-500 transition-colors"
                            >
                                <option value="default">Default OS Theme</option>
                                <option value="black">Pure Black (Stealth)</option>
                                <option value="neon-city">Neon City (Cyberpunk)</option>
                                <option value="abstract-waves">Abstract Waves (Modern)</option>
                                <option value="crimson-dawn">Crimson Dawn (Drama)</option>
                                <option value="royal-gold">Royal Gold (Premium)</option>
                                <option value="forest-mist">Forest Mist (Calm)</option>
                                <option value="cyber-punk">Cyber Punk (High Tech)</option>
                                <option value="slate-night">Slate Night (Professional)</option>
                                <option value="sunset-beach">Sunset Beach (Vibrant)</option>
                                <option value="arctic-ice">Arctic Ice (Clean)</option>
                                <option value="midnight-purple">Midnight Purple (Elegant)</option>
                                <option value="ocean-deep">Ocean Deep (Corporate)</option>
                                <option value="volcanic-ash">Volcanic Ash (Gritty)</option>
                                <option value="lavender-bliss">Lavender Bliss (Soft)</option>
                            </select>
                        </div>
                    </div>

                    {/* 5. Character Specifics */}
                    <div className="pt-2 border-t border-white/5 space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Keyboard Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={localState.keyboardColor || '#aeb3bc'}
                                        onChange={e => handleChange('keyboardColor', e.target.value)}
                                        className="w-8 h-8 rounded-md cursor-pointer border border-white/10 bg-surface-100 p-0.5 shadow-inner"
                                    />
                                    <span className="text-xs font-mono text-neutral-400 uppercase">{localState.keyboardColor || '#AEB3BC'}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Icon Style</label>
                                <select
                                    value={localState.iconStyle || 'classic'}
                                    onChange={(e) => handleChange('iconStyle', e.target.value as any)}
                                    className="w-full bg-surface-200 border border-white/5 rounded-lg p-2 text-[10px] text-white outline-none"
                                >
                                    <option value="classic">Classic / Stock</option>
                                    <option value="vibrant">Vibrant / Neon</option>
                                    <option value="tech">Tech Bro / Dark</option>
                                    <option value="social">Influencer / Soft</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-[10px] font-mono mb-1">
                                <span className="text-neutral-500 uppercase">Text Scale</span>
                                <span className="text-white">{localState.fontScale?.toFixed(1) || '1.0'}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.8" max="1.4" step="0.1"
                                value={localState.fontScale || 1.0}
                                onChange={(e) => handleChange('fontScale', parseFloat(e.target.value))}
                                className="w-full accent-accent-500 h-1 bg-surface-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title="Display Tool Override">
                    <select
                        value={localState.displayTool || ''}
                        onChange={(e) => handleChange('displayTool', (e.target.value || null) as any)}
                        className="w-full bg-surface-200 border border-white/5 rounded-lg p-2 text-xs text-white outline-none hover:border-accent-500/50 focus:border-accent-500 transition-colors"
                    >
                        <option value="">None (Show App)</option>
                        <option value="screen-green">Digital Green Screen</option>
                        <option value="screen-blue">Chroma Blue Screen</option>
                        <option value="screen-gray-18">18% Dark Gray Screen</option>
                        <option value="screen-gray-50">50% Light Gray Screen</option>
                        <option value="black">Pure Black Screen</option>
                        <option value="white">Pure White Screen</option>
                        <option value="color-chart">Macbeth Style Chart</option>
                        <option value="color-chart-colorchecker">ColorChecker Video</option>
                        <option value="color-chart-chromadumonde">DSC ChromaDuMonde</option>
                        <option value="grayscale-wedge">11-Step Grayscale Wedge</option>
                        <option value="smpte-bars">SMPTE Bars</option>
                    </select>

                    {['screen-green', 'screen-blue', 'screen-gray-18', 'screen-gray-50', 'black', 'white'].includes(localState.displayTool || '') && (
                        <div className="flex flex-col gap-2 mt-2">
                            <select
                                value={localState.displayToolGrid || ''}
                                onChange={(e) => handleChange('displayToolGrid', (e.target.value || null) as any)}
                                className="w-full bg-surface-200 border border-white/5 rounded-lg p-2 text-xs text-white outline-none hover:border-accent-500/50 focus:border-accent-500 transition-colors"
                            >
                                <option value="">No Grid Overlay</option>
                                <option value="thirds">Rule of Thirds</option>
                                <option value="golden-ratio">Golden Ratio (Phi Grid)</option>
                                <option value="golden-spiral">Golden Spiral Guide</option>
                                <option value="crosshair">Center Crosshair</option>
                            </select>

                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-surface-200 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={localState.displayToolMarkers || false}
                                    onChange={(e) => handleChange('displayToolMarkers', e.target.checked)}
                                    className="w-4 h-4 accent-accent-500 bg-surface-300 border border-white/20 rounded cursor-pointer"
                                />
                                <span className="text-xs font-medium text-white">Show Tracking Dots</span>
                            </label>
                        </div>
                    )}
                </CollapsibleSection>

                <CollapsibleSection title="Status Simulation" defaultOpen={true}>
                    {/* Time */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">System Time</label>
                        <input
                            type="time"
                            value={localState.time || ''}
                            onChange={(e) => handleChange('time', e.target.value)}
                            className="w-full bg-surface-200 border border-white/5 rounded-lg p-2 text-xs text-white outline-none hover:border-accent-500/50 focus:border-accent-500 transition-colors"
                        />
                    </div>

                    {/* Carrier */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Carrier / Network</label>
                        <input
                            type="text"
                            value={localState.carrier || ''}
                            onChange={(e) => handleChange('carrier', e.target.value)}
                            placeholder="e.g. AT&T, ScreenSlaver"
                            className="input-field w-full text-xs py-2"
                        />
                    </div>

                    {/* Battery */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-neutral-400 uppercase">Battery</span>
                            <span className="text-white">{localState.battery}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="100"
                            value={localState.battery}
                            onChange={(e) => handleChange('battery', parseInt(e.target.value))}
                            className="w-full accent-accent-500 h-1 bg-surface-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Signal */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-neutral-400 uppercase">Cellular Signal</span>
                            <span className="text-white">{localState.signal}/4</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="4"
                            value={localState.signal}
                            onChange={(e) => handleChange('signal', parseInt(e.target.value) as any)}
                            className="w-full accent-accent-500 h-1 bg-surface-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Wi-Fi */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 cursor-pointer p-1 rounded-lg bg-surface-200 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors tooltip">
                                <input
                                    type="checkbox"
                                    checked={localState.wifi || false}
                                    onChange={(e) => handleChange('wifi', e.target.checked)}
                                    className="w-4 h-4 accent-accent-500 bg-surface-300 border border-white/20 rounded cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Wi-Fi Enabled</span>
                            </label>
                        </div>
                        <div className={`transition-opacity ${localState.wifi ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                            <div className="flex justify-between text-[10px] font-mono mb-1">
                                <span className="text-neutral-400 uppercase">Wi-Fi Strength</span>
                                <span className="text-white">{localState.wifiStrength || 0}/3</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="3"
                                value={localState.wifiStrength || 0}
                                onChange={(e) => handleChange('wifiStrength', parseInt(e.target.value) as any)}
                                className="w-full accent-accent-500 h-1 bg-surface-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* 5. Text Input (Only for Keyboard Mode) */}
                {localState.currentApp === 'keyboard' && (
                    <CollapsibleSection title="Keyboard Input" defaultOpen={true}>
                        <textarea
                            value={localState.typedText || ''}
                            onChange={(e) => handleChange('typedText', e.target.value)}
                            placeholder="Type to appear on device..."
                            className="w-full h-32 bg-surface-900/50 border border-white/5 rounded-xl p-3 text-xs text-white focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20 outline-none resize-none transition-all placeholder:text-neutral-600 font-mono"
                        />
                        <p className="text-[9px] text-neutral-500 mt-1 italic leading-relaxed">
                            Text typed here will be synchronized to the Receiver in real-time.
                        </p>
                    </CollapsibleSection>
                )}
            </div>

            <div className="p-4 bg-surface-200 border-t border-white/5">
                <button
                    onClick={() => handleChange('screenLocked', !localState.screenLocked)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all border
                        ${localState.screenLocked
                            ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
                            : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                        }`}
                >
                    {localState.screenLocked ? 'Device Locked' : 'Device Unlocked'}
                </button>
            </div>
        </div>
    );
}
