export default {
  // Target (https://go.nuxtjs.dev/config-target)
  //target: 'static',
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'VindThingUI',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js",
        type: "text/javascript"
      },
      {
        src:
          "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js",
        type: "text/javascript"
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

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
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'http://localhost:8080/'
  },

  auth: {
    rewriteRedirects: true,
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/',
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/signin', method: 'post', propertyName: 'accessToken' },
          logout: false,
          user: { url: '/api/auth/profile/get', method: 'get', propertyName: false },
        }
      }
    }
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
