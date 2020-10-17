<template>
  <div class="alert alert-danger" role="alert">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: ['message']
}
</script>