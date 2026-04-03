/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0f0a',
                primary: {
                    DEFAULT: '#25D366',
                    hover: '#1ebe5a',
                }
            },
            fontFamily: {
                sans: ['"DM Sans"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
