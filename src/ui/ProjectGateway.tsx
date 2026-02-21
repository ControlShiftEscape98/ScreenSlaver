import { useState } from 'react';
import { useModeStore } from '../core/modeManager';
import { useSessionStore } from '../core/sessionManager';
import { SyncEngine } from '../core/syncEngine';
import { Session } from '../types';

export default function ProjectGateway() {
    const { setMode } = useModeStore();
    const { createSession, loadSessionFromDb } = useSessionStore();

    const [viewingWorkspaces, setViewingWorkspaces] = useState(false);
    const [workspaces, setWorkspaces] = useState<Session[]>([]);
    const [loading, setLoading] = useState(false);

    const handleNewSession = async () => {
        await createSession(); // Generate new session code and save to DB
        setMode('controller'); // Navigate to Dashboard
    };

    const handleLoadWorkspace = async () => {
        setViewingWorkspaces(true);
        setLoading(true);
        const fetched = await SyncEngine.fetchUserWorkspaces();
        setWorkspaces(fetched);
        setLoading(false);
    };

    const handleSelectWorkspace = async (sessionId: string) => {
        setLoading(true);
        const success = await loadSessionFromDb(sessionId);
        setLoading(false);
        if (success) {
            setMode('controller');
        } else {
            alert("Failed to load workspace.");
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden bg-surface-base">
            <button
                onClick={() => setMode('home')}
                className="absolute top-6 left-6 text-neutral-400 hover:text-white flex items-center gap-2 font-bold text-sm transition-colors"
                id="btn-back-home"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to Home
            </button>

            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />

            <div className="text-center mb-10 animate-float-in relative z-10 w-full max-w-2xl">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Project <span className="text-accent-500">Gateway</span>
                </h1>
                <p className="text-neutral-500 text-sm mt-2 font-medium tracking-wide">
                    {viewingWorkspaces ? "Select a saved workspace to resume." : "Start a new production session or resume a saved workspace."}
                </p>
            </div>

            {viewingWorkspaces ? (
                <div className="w-full max-w-2xl bg-surface-200 border border-neutral-800 rounded-3xl p-6 relative z-10 animate-float-in-delay-1 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Saved Workspaces</h2>
                        <button
                            onClick={() => setViewingWorkspaces(false)}
                            className="text-neutral-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : workspaces.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                                <path d="M3 3v18h18" />
                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                            </svg>
                            <p>No saved workspaces found.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {workspaces.map(ws => (
                                <button
                                    key={ws.id}
                                    onClick={() => handleSelectWorkspace(ws.id)}
                                    className="w-full text-left p-4 rounded-xl bg-surface-300 hover:bg-surface-400 border border-transparent hover:border-neutral-700 transition-all group flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="text-white font-bold group-hover:text-accent-500 transition-colors">{ws.name}</h3>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            Code: {ws.code} • Last edited: {new Date(ws.savedAt!).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-500 group-hover:text-accent-500 transition-colors">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10 animate-float-in-delay-1">
                    {/* New Session Tile */}
                    <button
                        onClick={handleNewSession}
                        className="mode-tile text-left group flex flex-col items-center text-center p-8 bg-surface-200"
                        id="btn-new-session"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-6 group-hover:bg-accent-500/20 transition-colors">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">New Session</h2>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            Create a fresh environment. Generate a new session code to pair devices on set.
                        </p>
                        <div className="mt-auto px-6 py-2 bg-accent-500/20 text-accent-500 font-bold rounded-full text-sm group-hover:bg-accent-500 group-hover:text-white transition-all">
                            Create Session
                        </div>
                    </button>

                    {/* Load Workspace Tile */}
                    <button
                        onClick={handleLoadWorkspace}
                        className="mode-tile text-left group flex flex-col items-center text-center p-8 bg-surface-200"
                        id="btn-load-workspace"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-neutral-500/10 border border-neutral-500/20 flex items-center justify-center mb-6 group-hover:bg-neutral-500/20 transition-colors">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-400 group-hover:text-white transition-colors">
                                <path d="M3 3v18h18" />
                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Load Workspace</h2>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            Resume a previously saved session. Restores devices, cues, and screen states.
                        </p>
                        <div className="mt-auto px-6 py-2 bg-neutral-500/20 text-neutral-300 font-bold rounded-full text-sm group-hover:bg-neutral-700 transition-all">
                            Browse Saves
                        </div>
                    </button>
                </div>
            )}

            <p className="absolute bottom-6 text-neutral-600 text-xs tracking-wider animate-float-in-delay-3 text-center">
                Requires network connection to broadcast session codes.
            </p>
        </div>
    );
}
