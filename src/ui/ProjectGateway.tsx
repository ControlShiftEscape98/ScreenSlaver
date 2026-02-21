import { useState } from 'react';
import { useModeStore } from '../core/modeManager';
import { useSessionStore } from '../core/sessionManager';
import { useAuthStore } from '../core/authManager';
import { SyncEngine } from '../core/syncEngine';
import { Session } from '../types';

export default function ProjectGateway() {
    const { setMode } = useModeStore();
    const { createSession, loadSessionFromDb } = useSessionStore();
    const { user, signInWithGoogle, signOut } = useAuthStore();

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
                className="absolute top-6 left-6 text-neutral-400 hover:text-white flex items-center gap-2 font-bold text-sm transition-colors z-50"
                id="btn-back-home"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Back to Home
            </button>

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
