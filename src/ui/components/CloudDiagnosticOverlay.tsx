import React from 'react';
import { useSessionStore } from '../../core/sessionManager';
import { useAuthStore } from '../../core/authManager';

export function CloudDiagnosticOverlay() {
    const { lastErrors, sessionId, sessionCode, connected, syncEnabled } = useSessionStore();
    const { user, session: authSession, isLoading: authLoading } = useAuthStore();
    const [isOpen, setIsOpen] = React.useState(false);

    // Triple-tap or keyboard shortcut could open this, but for now we'll just show a small indicator
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-[9999] w-6 h-6 bg-accent-500/20 hover:bg-accent-500/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all active:scale-95"
                title="Cloud Diagnostics"
            >
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-md bg-surface-400 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 bg-surface-300 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-sm font-black tracking-widest uppercase text-white/40">Cloud Diagnostics</h2>
                    <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Connection Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-white/40 uppercase font-black">Link Status</p>
                            <p className={`text-sm font-bold mt-1 ${connected ? 'text-green-400' : 'text-red-400'}`}>
                                {connected ? 'CONNECTED' : 'DISCONNECTED'}
                            </p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-white/40 uppercase font-black">Sync Engine</p>
                            <p className={`text-sm font-bold mt-1 ${syncEnabled ? 'text-accent-400' : 'text-neutral-500'}`}>
                                {syncEnabled ? 'ACTIVE' : 'IDLE'}
                            </p>
                        </div>
                    </div>

                    {/* Auth State */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] text-white/40 uppercase font-black px-1">Authentication</h3>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60">User Identity</span>
                                <span className="text-xs font-mono text-white/80">
                                    {authLoading ? '...' : user ? (user.is_anonymous ? 'Anonymous' : user.email) : 'Guest (No Auth)'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60">JWT Token</span>
                                <span className={`text-[10px] font-mono ${authSession ? 'text-green-400' : 'text-red-400'}`}>
                                    {authSession ? 'VALID' : 'MISSING'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] text-white/40 uppercase font-black px-1">Active Session</h3>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60">Session ID</span>
                                <span className="text-[10px] font-mono text-white/40 truncate ml-4">{sessionId || 'none'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60">Session Code</span>
                                <span className="text-sm font-black text-accent-400">{sessionCode || '---'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Error Log */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] text-white/40 uppercase font-black px-1 text-red-400">Error Log (Last 5)</h3>
                        <div className="space-y-2">
                            {lastErrors.length === 0 ? (
                                <p className="text-xs text-white/20 italic px-1">No errors captured yet...</p>
                            ) : (
                                lastErrors.map((err, i: number) => (
                                    <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] text-red-500 font-black uppercase">{err.type}</span>
                                            <span className="text-[9px] text-white/20">{new Date(err.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-xs text-red-200 leading-relaxed font-medium">{err.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-surface-300 border-t border-white/5">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold rounded-xl border border-white/5 transition-all"
                    >
                        Hard Reset Engine
                    </button>
                </div>
            </div>
        </div>
    );
}
