const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
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
                sans: [
                    'Inter var',
                    'Scheherazade New',
                    ...defaultTheme.fontFamily.sans,
                ],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
