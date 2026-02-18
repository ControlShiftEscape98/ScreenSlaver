/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // ScreenSlaver Design System
                // Base44 orange accent palette
                accent: {
                    DEFAULT: '#f97316',  // Primary orange
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',       // Main accent
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                // Obsidian / Charcoal surface palette
                surface: {
                    DEFAULT: '#1a1a1e',
                    50: '#2a2a2e',    // Elevated cards
                    100: '#232328',    // Card background
                    200: '#1a1a1e',    // Main background
                    300: '#141418',    // Deeper background
                    400: '#0e0e12',    // Deepest / true black
                    500: '#0a0a0e',
                },
                // Status colors
                online: '#22c55e',
                offline: '#6b7280',
                warning: '#eab308',
                danger: '#ef4444',
                // Cue type colors
                cue: {
                    incoming: '#3b82f6',
                    outgoing: '#8b5cf6',
                    text: '#06b6d4',
                    notification: '#f59e0b',
                    alarm: '#ef4444',
                    home: '#22c55e',
                    lock: '#6366f1',
                    idle: '#6b7280',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            boxShadow: {
                'glow-accent': '0 0 20px rgba(249, 115, 22, 0.3)',
                'glow-accent-lg': '0 0 40px rgba(249, 115, 22, 0.4)',
                'glow-online': '0 0 10px rgba(34, 197, 94, 0.4)',
                'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.5)',
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)' },
                    '50%': { boxShadow: '0 0 30px rgba(249, 115, 22, 0.5)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '20px',
            },
        },
    },
    plugins: [],
}
