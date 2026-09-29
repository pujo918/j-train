/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        washi: {
          DEFAULT: "#FAF7F2",
          paper: "#FFFFFF",
          tint: "#F5F0E8",
        },
        crimson: {
          DEFAULT: "#B91C1C",
          scarlet: "#DC2626",
          dark: "#991B1B",
          tint: "#FEE2E2",
          subtle: "#FEF2F2",
        },
        sumi: {
          DEFAULT: "#111827",
          charcoal: "#4B5563",
          muted: "#9CA3AF",
          border: "#E5E7EB",
          light: "#F3F4F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "sans-serif"],
        jp: ["var(--font-noto-jp)", "BIZ UDPGothic", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.04)",
        float: "0 8px 24px -4px rgba(185, 28, 28, 0.12)",
      },
      borderRadius: {
        '2xl': '16px',
        'xl': '12px',
      },
    },
  },
  plugins: [],
};
