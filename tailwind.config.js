/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: { '2xl': '1400px' },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                /* Pastel palette — direct access in Tailwind */
                paper: '#fef3ee',
                'paper-2': '#fde5dd',
                'lila': '#d9c7f5',
                'lila-2': '#c4adea',
                'lila-soft': '#ede4fa',
                melocoton: '#ffb59a',
                mint: '#b8e6d2',
                butter: '#ffe5a0',
                ink: '#2d1b3d',
                'ink-2': '#4d3361',
                'ink-soft': '#8a7099',
                'accent-pink': '#ff6b9d',
                'accent-deep': '#c4458b',
                plum: '#b794d4',
                gold: '#ffd166',
            },
            borderRadius: {
                sm: 'var(--r-sm)',
                DEFAULT: 'var(--r-sm)',
                md: 'var(--r-md)',
                lg: 'var(--r-lg)',
                xl: 'var(--r-xl)',
                full: '999px',
                /* Keep shadcn compatibility */
                'shadcn-lg': 'var(--radius)',
                'shadcn-md': 'calc(var(--radius) - 2px)',
                'shadcn-sm': 'calc(var(--radius) - 4px)',
            },
            boxShadow: {
                soft: '0 2px 8px rgba(45,27,61,.06), 0 12px 32px rgba(196,69,139,.08)',
                card: '0 4px 12px rgba(45,27,61,.08), 0 24px 48px -8px rgba(196,69,139,.18)',
                sticker: '0 4px 0 rgba(45,27,61,.12), 0 8px 24px rgba(196,69,139,.2)',
                ink: '5px 5px 0 #2d1b3d',
                'ink-sm': '3px 3px 0 #2d1b3d',
                'ink-xs': '2px 2px 0 #2d1b3d',
            },
            fontFamily: {
                display: ['var(--font-anton)', 'Impact', 'sans-serif'],
                sans: ['var(--font-antonio)', 'system-ui', 'sans-serif'],
                serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
                'serif-italic': ['var(--font-fraunces)', 'Georgia', 'serif'],
                mono: ['var(--font-dm-mono)', 'ui-monospace', 'monospace'],
                hand: ['var(--font-caveat)', 'cursive'],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
                'fade-in': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'bounce-soft': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'heart-beat': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '25%': { transform: 'scale(1.1)' },
                    '50%': { transform: 'scale(1)' },
                },
                'scroll-x': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
                'heart-beat': 'heart-beat 1.5s ease-in-out infinite',
                'scroll-x': 'scroll-x 30s linear infinite',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
