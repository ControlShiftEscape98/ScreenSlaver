import { useState } from 'react';
import { useModeStore } from './core/modeManager';
import { useSessionStore } from './core/sessionManager';

function App() {
    const { mode, setMode } = useModeStore();
    const { sessionCode, createSession, joinSession, connected, role } = useSessionStore();
    const [inputCode, setInputCode] = useState('');

    if (mode === 'setup') {
        return (
            <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-bold">ScreenSlaver Studio</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => { setMode('controller'); createSession(); }}
                            className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 font-bold"
                        >
                            Controller (Host)
                        </button>
                        <button
                            onClick={() => setMode('receiver')}
                            className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 font-bold"
                        >
                            Receiver (Join)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'controller') {
        return (
            <div className="min-h-screen bg-neutral-900 text-white p-8">
                <h1 className="text-2xl font-bold mb-4">Controller Mode</h1>
                <div className="bg-neutral-800 p-4 rounded">
                    <p>Session Code: <span className="text-4xl font-mono text-green-400">{sessionCode || 'Generating...'}</span></p>
                    <p className="mt-2">Status: {connected ? 'Online' : 'Connecting...'}</p>
                    <p>Role: {role}</p>
                </div>
                <button onClick={() => window.location.reload()} className="mt-8 text-neutral-400 hover:text-white">
                    &larr; Reset
                </button>
            </div>
        );
    }

    if (mode === 'receiver') {
        return (
            <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-8">Receiver Mode</h1>
                {!connected ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter 6-digit Code"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                            className="px-4 py-2 text-black text-center text-2xl font-mono rounded w-64"
                            maxLength={6}
                        />
                        <button
                            onClick={() => joinSession(inputCode, 'My Device')}
                            className="block w-full px-6 py-3 bg-green-600 rounded hover:bg-green-700 font-bold"
                        >
                            Join Session
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-green-400 text-xl">Connected!</p>
                        <p>Waiting for controller...</p>
                    </div>
                )}
                <button onClick={() => window.location.reload()} className="mt-8 text-neutral-400 hover:text-white">
                    &larr; Back
                </button>
            </div>
        );
    }

    return null;
}

export default App;
