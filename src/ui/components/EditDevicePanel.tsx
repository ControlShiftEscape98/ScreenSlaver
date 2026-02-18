import { useState, useEffect } from 'react';
import type { ScreenUnit, DeviceState } from '../../types';
import { useSessionStore } from '../../core/sessionManager';

interface EditDevicePanelProps {
    device: ScreenUnit;
    onClose: () => void;
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
        <div className="w-[320px] border-l border-white/5 bg-surface-400 flex flex-col shadow-2xl z-40 animate-slide-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-surface-200">
                <div>
                    <h2 className="text-sm font-bold text-white tracking-wide uppercase">Edit Device</h2>
                    <p className="text-[10px] text-accent-500 font-bold">{device.name}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
                {/* 1. View Mode (currentApp) */}
                <section>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 block">View Mode</label>
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
                </section>

                {/* 2. Theme (skin) */}
                <section>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 block">Visual Theme</label>
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
                </section>

                {/* 3. Status Bar Simulation */}
                <section className="space-y-4">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 block">Status Simulation</label>

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
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-neutral-400 uppercase">Signal Strength</span>
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
                </section>

                {/* 4. Text Input (Only for Keyboard Mode) */}
                {localState.currentApp === 'keyboard' && (
                    <section className="animate-fade-in">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 block">Keyboard Input</label>
                        <textarea
                            value={localState.typedText || ''}
                            onChange={(e) => handleChange('typedText', e.target.value)}
                            placeholder="Type to appear on device..."
                            className="w-full h-32 bg-surface-900/50 border border-white/5 rounded-xl p-3 text-xs text-white focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20 outline-none resize-none transition-all placeholder:text-neutral-600 font-mono"
                        />
                        <p className="text-[9px] text-neutral-500 mt-2 italic leading-relaxed">
                            Text typed here will be synchronized to the Receiver in real-time using the selected skin's presentation.
                        </p>
                    </section>
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
