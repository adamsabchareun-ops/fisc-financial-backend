/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                "off-white": "#F9F9F7",
                "text-charcoal": "#2D2D2D",
                "soft-sage": "#E9F0E9",
                "primary-green": "#4A5D4E",
            },
            borderRadius: {
                organic: "24px",
            },
        },
    },
    plugins: [],
};
