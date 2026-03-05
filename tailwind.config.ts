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
          red:     '#E8340A',
          'red-dark': '#B52708',
          orange:  '#FF6B2B',
          cream:   '#FFF8F0',
          'cream-dark': '#F5EDE0',
          brown:   '#2C1A0E',
          'brown-mid': '#5C3D2E',
          gold:    '#D4A853',
          gray:    '#8A7A70',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        soft:  '0 4px 24px rgba(44,26,14,0.10)',
        card:  '0 2px 12px rgba(44,26,14,0.07)',
        brand: '0 4px 20px rgba(232,52,10,0.35)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease both',
        'fade-in':    'fadeIn 0.3s ease both',
        'slide-in':   'slideIn 0.3s ease both',
        'pop':        'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'pulse-dot':  'pulseDot 2s ease infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn:  { from: { opacity: '0', transform: 'translateX(12px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pop:      { from: { opacity: '0', transform: 'scale(0.8)' }, to: { opacity: '1', transform: 'scale(1)' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.5', transform: 'scale(1.3)' } },
      },
    },
  },
  plugins: [],
}

export default config
