<template>
  <b-notification
    type="is-danger is-light"
    role="alert"
    :closable=false
  >
    {{ message }}
  </b-notification>
</template>

<script>
export default {
  /* Set an Notification message to local store */
  name: 'Notification',
  props: ['message']
}
</script>
