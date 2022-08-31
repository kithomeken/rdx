module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {},
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
            opacity: ['disabled'],
            textColor: ['visited'],
        },
    },
    plugins: [],
    content: []
}
