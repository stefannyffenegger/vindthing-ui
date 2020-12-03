<template>
  <div>
    <Navbar/>
    <LazyWebSocketService v-if=this.$auth.loggedIn></LazyWebSocketService>
    <nuxt/>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  components: { Navbar },

  async mounted() {
  }
}
</script>