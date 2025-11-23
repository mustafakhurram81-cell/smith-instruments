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
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                stone: {
                    50: '#faf9f6', // Warm Alabaster/Cream
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917', // Warm Charcoal
                    950: '#0c0a09',
                },
                brand: {
                    gold: '#C5B495', // Muted Gold/Beige
                    charcoal: '#262626', // Deep Rich Charcoal
                    dark: '#1c1917', // Stone 900
                    light: '#faf9f6', // Stone 50
                }
            }
        },
    },
    plugins: [],
}
