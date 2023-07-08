/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}",
      "./app.vue",
    ],
    theme: {
      extend: {
        fontFamily: {
          'sans': ["RoobertPRO","RoobertPRO override","sans-serif"],
        },
        colors: {
          cortex: {
            'light-green': '#C4F1BE',
            'green': '#A2C3A4',
            'dark-green': '#869D96',
            'blue': '#525B76',
            'dark-blue': '#201E50',
          },
        },
      },
    },
    plugins: [],
  }
  