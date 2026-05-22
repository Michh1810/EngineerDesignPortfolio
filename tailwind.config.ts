import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './sandbox/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#080808',
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
      fontSize: {
        'display-1': ['72px', { lineHeight: '1.05', fontWeight: '600' }],
        'display-2': ['46px', { lineHeight: '1.1', fontWeight: '500' }],
        h1: ['30px', { lineHeight: '1.15', fontWeight: '500' }],
        h2: ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.25', fontWeight: '500' }],
        body: ['17px', { lineHeight: '1.55', fontWeight: '400' }],
        button: ['17px', { lineHeight: '1.2', fontWeight: '600' }],
        subtext: ['15px', { lineHeight: '1.4', fontWeight: '700' }],
        footnote: ['15px', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

export default config
