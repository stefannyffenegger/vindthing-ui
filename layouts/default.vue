<template>
  <div>
    <Navbar/>
    <LazyWebSocketService v-if=this.$auth.loggedIn></LazyWebSocketService>
    <nuxt/>
  </div>
</template>

<script>
/* Import Navigation to all Pages */
import Navbar from '~/components/Navbar'

export default {
  components: { Navbar }
}
</script>