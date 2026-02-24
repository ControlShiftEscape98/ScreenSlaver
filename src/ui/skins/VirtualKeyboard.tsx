import { useState } from 'react';

interface VirtualKeyboardProps {
    onType?: (char: string) => void;
    onDelete?: () => void;
    onEnter?: () => void;
    theme?: 'ios' | 'android';
    keyboardColor?: string;
}

const KEYS_IOS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace'],
    ['123', 'space', 'return']
];

const KEYS_ANDROID = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ['?123', ',', 'space', '.', 'return']
];

export default function VirtualKeyboard({ onType, onDelete, onEnter, theme = 'ios', keyboardColor }: VirtualKeyboardProps) {
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const isIOS = theme === 'ios';
    const keys = isIOS ? KEYS_IOS : KEYS_ANDROID;

    // Default colors if not provided
    const defaultKeyColor = isIOS ? '#AEB3BC' : '#CFD8DC';
    const defaultRegularKeyColor = isIOS ? '#FFFFFF' : '#F5F5F5';
    const effectiveKeyColor = keyboardColor || defaultKeyColor;
    const effectiveRegularKeyColor = keyboardColor || defaultRegularKeyColor;

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
        <div className={`w-full h-full pt-2 pb-6 px-1 select-none flex flex-col justify-end transition-colors ${isIOS ? 'bg-[#d1d5db]' : 'bg-[#ECEFF1]'}`}>
            {keys.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center w-full mb-2 gap-1 px-1">
                    {row.map((key) => {
                        const isSpecial = key.length > 1 && key !== 'space';
                        const isActive = activeKey === key;

                        let width = 'flex-1';
                        if (key === 'space') width = 'flex-[4]';
                        if (key === 'return' || key === '?123' || key === '123') width = 'flex-[1.5]';
                        if (key === 'shift' || key === 'backspace') width = 'flex-[1.2]';

                        return (
                            <button
                                key={key}
                                onTouchStart={(e) => { e.preventDefault(); handleTouchStart(key); }}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={(e) => { e.preventDefault(); handleTouchStart(key); }}
                                onMouseUp={handleTouchEnd}
                                onMouseLeave={handleTouchEnd}
                                className={`
                                    h-12 flex items-center justify-center text-xl transition-all duration-75 shadow-sm
                                    ${width}
                                    ${isIOS ? 'rounded-md mx-0.5' : 'rounded-none mx-0.25'}
                                    ${isActive ? (isIOS ? 'bg-black/20 scale-95' : 'bg-accent-500 text-white') : ''}
                                `}
                                style={{
                                    backgroundColor: isActive ? undefined : (isSpecial ? effectiveKeyColor : effectiveRegularKeyColor),
                                    color: isIOS ? (isSpecial ? 'rgba(0,0,0,0.7)' : '#000') : (isSpecial ? '#455A64' : '#000')
                                }}
                            >
                                {key === 'backspace' ? (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
                                ) : key === 'shift' ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4L4 16h16L12 4z" /></svg>
                                ) : key === 'return' ? (
                                    <span className="text-[14px] font-medium leading-none">{isIOS ? 'return' : 'ENTER'}</span>
                                ) : key === 'space' ? (
                                    <div className={`w-8 h-1 rounded-full ${isIOS ? 'bg-black/10' : 'bg-black/5'}`} />
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
