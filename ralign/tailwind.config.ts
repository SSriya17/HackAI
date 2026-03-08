import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "comet-orange": "#ffb347",
                "galaxy-green": "#00E676",
                "antony-purple": "#2e1a47",
                background: "#0F0A19",
                foreground: "#f8fafc",
            },
            borderRadius: {
                "2xl": "1rem",
            },
        },
    },
    plugins: [],
};
export default config;
