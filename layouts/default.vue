<template>
  <div>
    <Navbar/>
    <nuxt/>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import WebSocketService from '~/plugins/WebSocketService.js'

export default {
  components: { Navbar },

  async mounted() {
    console.log(WebSocketService)
    let res = await WebSocketService.connect()
    WebSocketService.send("luedi")
    // this.connect();
  }
}
</script>