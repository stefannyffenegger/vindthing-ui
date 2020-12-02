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
  name: 'Notification',
  props: ['message']
}
</script>
