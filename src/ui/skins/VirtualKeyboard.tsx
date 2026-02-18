import { useState } from 'react';

interface VirtualKeyboardProps {
    onType?: (char: string) => void;
    onDelete?: () => void;
    onEnter?: () => void;
    theme?: 'ios' | 'android';
}

const KEYS_IOS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace'],
    ['123', 'space', 'return']
];

export default function VirtualKeyboard({ onType, onDelete, onEnter, theme = 'ios' }: VirtualKeyboardProps) {
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const handleTouchStart = (key: string) => {
        setActiveKey(key);
        if (key === 'backspace') onDelete?.();
        else if (key === 'return') onEnter?.();
        else if (key === 'space') onType?.(' ');
        else if (key.length === 1) onType?.(key);
    };

    const handleTouchEnd = () => {
        setActiveKey(null);
    };

    return (
        <div className={`w-full bg-[#d1d5db] pt-2 pb-6 px-1 select-none animate-slide-up ${theme === 'android' ? 'bg-[#ECEFF1]' : ''}`}>
            {KEYS_IOS.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center w-full mb-3 gap-1.5">
                    {row.map((key) => {
                        const isSpecial = key.length > 1;
                        const isActive = activeKey === key;

                        let width = 'w-[8.5%]'; // default
                        if (key === 'space') width = 'w-[50%]';
                        if (key === 'return' || key === '123') width = 'w-[20%]';
                        if (key === 'shift' || key === 'backspace') width = 'w-[12%]';

                        return (
                            <button
                                key={key}
                                onTouchStart={() => handleTouchStart(key)}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={() => handleTouchStart(key)}
                                onMouseUp={handleTouchEnd}
                                onMouseLeave={handleTouchEnd}
                                className={`
                                    h-11 rounded-md text-xl font-normal shadow-sm transition-colors duration-75 flex items-center justify-center
                                    ${width}
                                    ${isSpecial ? 'bg-[#aeb3bc] text-black/80' : 'bg-white text-black'}
                                    ${isActive ? (isSpecial ? 'bg-white' : 'bg-[#aeb3bc]') : ''}
                                `}
                            >
                                {key === 'backspace' ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
                                ) : key === 'shift' ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4L4 16h16L12 4z" /></svg>
                                ) : key === 'return' ? (
                                    <span className="text-sm font-bold">return</span>
                                ) : key === 'space' ? (
                                    ''
                                ) : (
                                    key
                                )}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
