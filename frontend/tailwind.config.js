/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                maroon: {
                    600: '#800000',
                    700: '#600000',
                    800: '#400000',
                    50: '#fff0f0',
                    100: '#ffe0e0',
                },
                gold: {
                    400: '#FFD700',
                    500: '#E6C200',
                }
            }
        },
    },
    plugins: [],
}
