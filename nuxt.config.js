module.exports = {
  // Source directory of app code
  srcDir: './app',
  // head (injected via vue-meta)
  head: {
    // Page title
    title: 'Neural Game',
    // Meta tags
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Neural network training game'
      }
    ],
    // Link tags
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600'
      }
    ],
    // script tags
    script: [
      {
        defer: true,
        src: 'https://use.fontawesome.com/releases/v5.0.8/js/all.js'
      }
    ]
  },
  // top-bar loading bar
  loading: { color: '#3B8070' },
  // Inject sass into style bundle
  css: ['@/assets/style.scss']
};
