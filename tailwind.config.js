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
                    50: '#ffffff', // Pure White
                    100: '#f5f5f5', // True Neutral Light Grey
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717', // True Neutral Black
                    950: '#0a0a0a',
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
