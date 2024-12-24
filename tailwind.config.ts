import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'h1': '32px',
        'h2': '28px',
        'body': '16px',
      },
      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '700',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FFC1CC', // Light Pink
          hover: '#FFB1BE', // Slightly darker pink for hover states
        },
        secondary: {
          DEFAULT: '#FFFFFF', // White
          hover: '#F5F5F5', // Slightly darker white for hover states
        },
        accent: {
          DEFAULT: '#FF6F61', // Coral
          hover: '#FF5C4D', // Slightly darker coral for hover states
        },
      },
      animation: {
        'card-hover': 'card-hover 0.3s ease-in-out forwards',
      },
      keyframes: {
        'card-hover': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;