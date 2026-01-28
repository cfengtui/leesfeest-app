/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // New purple/indigo primary theme
                primary: {
                    light: '#E0E7FF',  // Light indigo
                    DEFAULT: '#6366F1', // Indigo
                    dark: '#4F46E5',   // Darker indigo
                },
                // Fun accent colors (keeping for buttons)
                brand: {
                    light: '#FFD166', // Sunny yellow
                    DEFAULT: '#06D6A0', // Fun green
                    dark: '#118AB2', // Ocean blue
                    accent: '#EF476F', // Watermelon
                },
                // Playful palette
                fun: {
                    purple: '#8B5CF6',
                    pink: '#EC4899',
                    orange: '#F97316',
                    teal: '#14B8A6',
                }
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 2s infinite',
                'float-slow': 'float 8s ease-in-out infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
