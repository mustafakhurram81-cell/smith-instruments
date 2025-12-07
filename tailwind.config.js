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
                    50: '#fafafa', // Clinical White
                    100: '#f4f4f5', // Zinc 100
                    200: '#e4e4e7', // Zinc 200 (Steel)
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b', // Cool Charcoal
                    950: '#09090b',
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
