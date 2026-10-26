/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FAF7F2",
          card: "#FFFDF9",
          text: "#1E2633",
          accent: "#C2462E",
          secondary: "#1F6F6B",
          muted: "#6B7280",
          border: "#E7E2DA",
          highlight: "#F4EBE1"
        },
        slack: {
          sidebar: "#3F0E40",
          sidebarHover: "#350d36",
          sidebarActive: "#1164A3",
          sidebarText: "#BCABB8",
          sidebarTextActive: "#FFFFFF",
          badge: "#CD2553",
          border: "#E8E8E8",
          bg: "#FFFFFF",
          inputBg: "#F8F8F8"
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Bricolage Grotesque", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
