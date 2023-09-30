const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },
        extend: {
            colors: {
                'primary-1': '#9acd33', //'#7bc060',
                'primary-2': '#33a44b',
                danger: colors.red,
                primary: colors.lime,
                success: colors.green,
                warning: colors.yellow,
            },
            fontFamily: {
                inter: [
                    "'Inter var', sans-serif",
                    {
                        fontFeatureSettings: "'cv03', 'cv04', 'cv11'",
                    },
                ],
                sans: 'Raleway, sans-serif',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
