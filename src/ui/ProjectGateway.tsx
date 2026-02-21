import { useModeStore } from '../core/modeManager';
import { useSessionStore } from '../core/sessionManager';

export default function ProjectGateway() {
    const { setMode } = useModeStore();
    const { createSession } = useSessionStore();

    const handleNewSession = () => {
        createSession(); // Generate new session code
        setMode('controller'); // Navigate to Dashboard
    };

    const handleLoadWorkspace = () => {
        // Placeholder for loading a saved workspace from Supabase/Local Storage
        alert("Loading saved workspaces will be available when Supabase is integrated.");
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

            <div className="text-center mb-10 animate-float-in relative z-10">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Project <span className="text-accent-500">Gateway</span>
                </h1>
                <p className="text-neutral-500 text-sm mt-2 font-medium tracking-wide">
                    Start a new production session or resume a saved workspace.
                </p>
            </div>

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

            <p className="absolute bottom-6 text-neutral-600 text-xs tracking-wider animate-float-in-delay-3 text-center">
                Requires network connection to broadcast session codes.
            </p>
        </div>
    );
}
