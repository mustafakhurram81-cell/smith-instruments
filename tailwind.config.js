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
                serif: ['Manrope', 'sans-serif'], // Geometric sans for headings (Belkins style)
            },
            borderRadius: {
                'none': '0',
                'sm': '2px',
                'DEFAULT': '4px',
                'md': '6px',
                'lg': '8px',
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
                'full': '9999px',
            },
            colors: {
                // Neutral gray scale (Belkins-inspired)
                gray: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#E5E5E5',
                    300: '#D4D4D4',
                    400: '#A3A3A3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#1F1F1F',
                    950: '#0A0A0A',
                },
                // Keep stone for backwards compatibility during migration
                stone: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#E5E5E5',
                    300: '#D4D4D4',
                    400: '#A3A3A3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#1F1F1F',
                    950: '#0A0A0A',
                },
                // Orange accent scale (Belkins primary)
                orange: {
                    50: '#FFF7ED',
                    100: '#FFEDD5',
                    200: '#FED7AA',
                    300: '#FDBA74',
                    400: '#FB923C',
                    500: '#F97316',
                    600: '#EA580C',
                    700: '#C2410C',
                    800: '#9A3412',
                    900: '#7C2D12',
                },
                brand: {
                    orange: '#FF5E00', // Belkins vibrant orange
                    gold: '#FF5E00', // Alias for backwards compatibility
                    charcoal: '#1F1F1F', // Softer black
                    dark: '#1F1F1F',
                    light: '#FAFAFA',
                }
            }
        },
    },
    plugins: [],
}
