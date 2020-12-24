<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>
          <p>{{$config}}</p>
          <p>{{$config.BASE_URL_API}}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>


export default {
  /* Guest Component to let anonymous Users on this page */
  middleware: "guest",

};
</script>
