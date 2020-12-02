<template>
  <div>
    <Navbar/>
    <LazyWebSocketService></LazyWebSocketService>
    <nuxt/>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  components: { Navbar },

  async mounted() {
    this.$store.dispatch("stores/getStores");

  }
}
</script>