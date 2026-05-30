import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './sandbox/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-hover': 'var(--color-border-hover)',
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
