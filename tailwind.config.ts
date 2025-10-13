import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
    // darkMode not used (light-only)
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './content/**/*.{md,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                kth: {
                    blue: '#004791',     // KTH blue
                    sky: '#6298d2',      // sky blue
                    marine: '#08004f',   // deep navy
                    light: '#e0edfc',    // very light blue
                    sand: '#e6e1dd',     // beige/sand
                    digital: '#221dd9',  // vivid digital blue
                },
            },
            fontFamily: {
                serif: ['var(--font-figtree)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                sans: ['var(--font-figtree)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['var(--font-jet)', 'ui-monospace', 'monospace']
            },
        },
    },
    plugins: [typography],
} satisfies Config