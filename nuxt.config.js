export default {
  // Target (https://go.nuxtjs.dev/config-target)
  //target: 'static',
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'VindThing',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js",
        type: "text/javascript"
      },
      {
        src: "https://cdn.jsdelivr.net/npm/sockjs-client@1.5.0/dist/sockjs.min.js",
        type: "text/javascript"
      },
      {
        src: "https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js",
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
    baseURL: 'http://localhost:8080/'
  },

  auth: {
    rewriteRedirects: true,
    redirect: {
      login: '/login',
      register: '/chat',
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
  }
}
