export default {

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    baseUrlAPI: process.env.BASE_URL_API || 'http://localhost:8080',
    baseUrlImage: process.env.BASE_URL_IMAGE || 'http://localhost:8080/api/image/download/',
    baseUrlQRCode: process.env.BASE_URL_QR_CODE || 'http://localhost:3000/stores?id=',
    baseUrlSockJS: process.env.BASE_URL_SOCK_JS || 'http://localhost:8080/chat',
  },

  // Target (https://go.nuxtjs.dev/config-target)
  //target: 'static',
  target: 'server',
  ssr: true,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'VindThing',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.8.55/css/materialdesignicons.min.css'
      }
    ],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js",
        type: "text/javascript"
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["@/assets/scss/main.scss"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    // 'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'nuxt-buefy'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'http://localhost:8080'
  },

  // Disables fetching materialDesignIcons cause offical CDN was down in December.
  // Fetching from other CDN in head section above.
  buefy: { materialDesignIcons: false },

  auth: {
    rewriteRedirects: true,
    redirect: {
      login: '/login',
      register: '/register',
      logout: '/login',
      callback: '/login',
      home: '/',
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/signin', method: 'post', propertyName: 'token' },
          register: {url: '/api/auth/signup', method: 'post', propertyName: false},
          logout: false,
          user: { url: '/api/auth/profile/get', method: 'get', propertyName: false }
        }
      }
    }
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // Fix for Server Side Rendering. Vee-validates needs to be transpiled for Server JS Compiler
    transpile: ['vee-validate','vee-validate/dist/rules']
  }
}
