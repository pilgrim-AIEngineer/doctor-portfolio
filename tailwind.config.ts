// Tailwind config — DocFolio design tokens; use only these colours in JSX
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          300: '#FFD700',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        navy: {
          DEFAULT: '#1a1a2e',
          light: '#252542',
          dark: '#0f0f1a',
        },
        clinical: {
          mist: '#f7fbff',
          line: '#d8e8f8',
          ink: '#12233f',
          soft: '#ecf6ff',
        },
        modern: {
          ink: '#0b1220',
          panel: '#101827',
          cyan: '#22d3ee',
          teal: '#14b8a6',
        },
        oncology: {
          midnight: '#050a1f',
          cobalt: '#102a6b',
          panel: '#0d1738',
          teal: '#2dd4bf',
          aura: '#67e8f9',
          gold: '#f8c861',
        },
        ivory: {
          DEFAULT: '#fffaf0',
          soft: '#f8f2e6',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)',    'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia',   'serif'],
      },
      boxShadow: {
        clinical: '0 24px 80px rgba(37, 99, 235, 0.12)',
        glass: '0 24px 90px rgba(2, 6, 23, 0.28)',
        gold: '0 24px 80px rgba(251, 191, 36, 0.14)',
        oncology: '0 30px 100px rgba(45, 212, 191, 0.18)',
        'oncology-gold': '0 22px 80px rgba(248, 200, 97, 0.18)',
      },
      keyframes: {
        'template-rise': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'template-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'template-sheen': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        'oncology-pulse': {
          '0%, 100%': { opacity: '0.42', transform: 'scale(1)' },
          '50%': { opacity: '0.78', transform: 'scale(1.06)' },
        },
      },
      animation: {
        'template-rise': 'template-rise 700ms ease-out both',
        'template-float': 'template-float 7s ease-in-out infinite',
        'template-sheen': 'template-sheen 3.4s ease-in-out infinite',
        'oncology-pulse': 'oncology-pulse 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
