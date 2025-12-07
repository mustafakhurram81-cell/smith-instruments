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
                serif: ['Playfair Display', 'serif'], // Restore Premium Serif for Headings
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
                    50: '#ffffff', // Keep Pure White for seamless blending
                    100: '#f5f5f4', // Warm Stone 100
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917', // Warm Charcoal (Restored)
                    950: '#0c0a09',
                },
                brand: {
                    gold: '#C9A96E', // Slightly richer gold for better visibility
                    charcoal: '#1c1917', // Restore Warm Charcoal (Matches Logo)
                    dark: '#1c1917',
                    light: '#ffffff',
                }
            }
        },
    },
    plugins: [],
}
