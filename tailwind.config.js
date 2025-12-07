/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Manrope', 'sans-serif'], // Replacing Playfair with Manrope for modern engineered look
            },
            borderRadius: {
                'none': '0',
                'sm': '0', // Force sharp corners even on small radii
                'DEFAULT': '0',
                'md': '0',
                'lg': '0',
                'xl': '0',
                '2xl': '0',
                '3xl': '0',
                'full': '9999px',
            },
            colors: {
                stone: {
                    50: '#ffffff', // Pure White for blending product images
                    100: '#f8fafc', // Ultra light slate
                    200: '#e2e8f0', // Slight separation
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a', // Deep Navy/Slate (The new "Black")
                    950: '#020617',
                },
                brand: {
                    gold: '#c5a059', // Metallic Matte Gold
                    charcoal: '#0f172a', // Align with Slate 900
                    dark: '#0f172a',
                    light: '#ffffff',
                }
            }
        },
    },
    plugins: [],
}
