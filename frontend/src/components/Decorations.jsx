import React from 'react'

/**
 * Floating decorative elements for a playful, kid-friendly background
 * Includes clouds, stars, leaves that float gently
 */
const Decorations = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Top left cloud */}
            <svg
                className="absolute top-4 left-4 w-24 h-16 text-white opacity-60 animate-float"
                viewBox="0 0 100 60"
                fill="currentColor"
            >
                <ellipse cx="30" cy="40" rx="25" ry="15" />
                <ellipse cx="55" cy="35" rx="20" ry="12" />
                <ellipse cx="45" cy="45" rx="22" ry="14" />
                <ellipse cx="70" cy="42" rx="18" ry="10" />
            </svg>

            {/* Top right cloud */}
            <svg
                className="absolute top-8 right-8 w-32 h-20 text-white opacity-50 animate-float-delayed"
                viewBox="0 0 100 60"
                fill="currentColor"
            >
                <ellipse cx="30" cy="40" rx="25" ry="15" />
                <ellipse cx="55" cy="35" rx="20" ry="12" />
                <ellipse cx="45" cy="45" rx="22" ry="14" />
                <ellipse cx="70" cy="42" rx="18" ry="10" />
            </svg>

            {/* Floating stars */}
            <svg
                className="absolute top-20 left-1/4 w-6 h-6 text-yellow-400 animate-float-slow"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            <svg
                className="absolute top-32 right-1/3 w-5 h-5 text-yellow-300 animate-float"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            <svg
                className="absolute bottom-40 left-12 w-4 h-4 text-purple-300 animate-float-delayed"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            {/* Floating leaves */}
            <svg
                className="absolute top-1/3 right-8 w-8 h-8 text-green-400 animate-float-slow opacity-70"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
            </svg>

            <svg
                className="absolute bottom-32 right-1/4 w-6 h-6 text-green-300 animate-float opacity-60"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
            </svg>

            {/* Bottom decorative wave/clouds */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent" />
        </div>
    )
}

export default Decorations
