import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './sandbox/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#070707',
        'text-primary': '#F0EDE8',
        'text-secondary': '#A09890',
        'text-muted': '#605850',
        'border-subtle': '#141414',
        'border-hover': '#242420',
      },
      fontFamily: {
        sans: ['var(--font-sf-pro-display)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-sf-pro-display)', 'Georgia', 'serif'],
        mono: ['"Courier New"', 'monospace'],
      },

    },
  },
  plugins: [],
}

export default config
