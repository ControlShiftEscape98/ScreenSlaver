import { useState } from 'react';

interface AiCopilotPanelProps {
    onClose: () => void;
}

export default function AiCopilotPanel({ onClose }: AiCopilotPanelProps) {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: 'CineBot Copilot online. Need ideas for screen cue text, terminal commands, or fake social media posts?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        // Fake AI response for MVP
        setTimeout(() => {
            const aiResponses = [
                "Here are 3 fake IP addresses for the terminal: 192.168.1.104, 10.0.0.52, 172.16.254.1",
                "How about this for a fake news headline: 'Global Markets Stumble as Tech Giant Falters'",
                "For a hacker sequence, try this command: 'sudo nmap -sS -O 192.168.1.0/24'",
                "Here's a dramatic incoming text message: 'They know. Get out of the building NOW.'",
                "Loading bar strings: 'Decrypting payload...', 'Bypassing firewall...', 'Extracting kernel data...'"
            ];
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            setMessages(prev => [...prev, { role: 'ai', content: randomResponse }]);
        }, 1000);
    };

    return (
        <div className="w-[340px] border-l border-white/5 bg-surface-500/95 backdrop-blur-xl flex flex-col shadow-2xl z-[100] animate-slide-left absolute right-0 top-0 bottom-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-accent-500/20 bg-surface-200">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent-500/20 flex flex-col items-center justify-center border border-accent-500/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide uppercase">AI Copilot</h2>
                        <p className="text-[10px] text-accent-500 font-bold">IDEA GENERATOR</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex max-w-[85%] ${msg.role === 'user' ? 'self-end bg-accent-600' : 'self-start bg-surface-200 border border-white/5'} rounded-2xl px-4 py-2 shadow-sm`}>
                        <p className={`text-[13px] leading-relaxed ${msg.role === 'user' ? 'text-white font-medium' : 'text-neutral-300'}`}>
                            {msg.content}
                        </p>
                    </div>
                ))}
            </div>

            {/* Input Box */}
            <div className="p-4 bg-surface-300 border-t border-white/5">
                <div className="relative flex items-center bg-surface-100 border border-white/10 rounded-xl overflow-hidden focus-within:border-accent-500/50 transition-colors shadow-inner">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                        placeholder="Ask for ideas..."
                        className="w-full bg-transparent text-sm text-white px-4 py-3 outline-none placeholder:text-neutral-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 p-1.5 bg-accent-500 text-white rounded-lg disabled:opacity-30 disabled:bg-neutral-600 transition-all"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
                <p className="text-[9px] text-neutral-500 text-center mt-3 uppercase tracking-wider font-bold">
                    CineBot Assistant MVP
                </p>
            </div>
        </div>
    );
}
