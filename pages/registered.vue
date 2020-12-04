<template>
  <section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h2 class="title has-text-centered">
              Confirm your account!
            </h2>
          </div>
        </div>
      </div>
    </section>
    <section class="section has-background-white-bis">
      <div class="container">
        <b-steps v-model="activeStep" :has-navigation="false" size="is-medium">
          <b-step-item
            label="Register"
            icon="account-plus"
            :clickable=false
            type="is-success"
          ></b-step-item>
          <b-step-item
            label="Confirm Email"
            icon="email-check"
            :clickable=false
            type="is-info"
          >
            <hr>
            <h2 class="subtitle has-text-primary has-text-centered">
              Please check your inbox and confirm your account with the provided link
            </h2>
          </b-step-item>
          <b-step-item
            label="Login"
            icon="account-key"
            :clickable=false
          ></b-step-item>
        </b-steps>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  middleware: "guest",
  data() {
    return {
      activeStep: 1,
    };
  },
};
</script>
