<template>
  <section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h2 v-if="error" class="title has-text-centered">
               {{ error }}
            </h2>
            <h2 v-else class="title has-text-centered">
              {{ successMessage }}
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
            :clickable="false"
            type="is-success"
          ></b-step-item>
          <b-step-item
            v-if="error"
            label="Confirm Email"
            icon="message-alert"
            :clickable="false"
            type="is-danger"
          >
            <hr />
            <h2 class="subtitle has-text-primary has-text-centered">
              Sorry, your confirmation E-Mail is expired. Please request a new
              one!
            </h2>
            <div class="buttons is-centered">
              <b-button type="is-primary" class="button is-dark">
                Request a new Confirmation E-Mail
              </b-button>
            </div>
          </b-step-item>
          <b-step-item
            v-else
            label="Confirm E-Mail"
            icon="email-check"
            :clickable="false"
            type="is-success"
          >
            <hr />
            <h2 class="subtitle has-text-primary has-text-centered">
              Login with your brand new account
            </h2>
            <div class="buttons is-centered">
              <NuxtLink to="/login">
                <b-button type="is-primary" class="button is-dark">
                  Login
                </b-button>
              </NuxtLink>
            </div>
          </b-step-item>
          <b-step-item
            label="Login"
            icon="account-key"
            :clickable="false"
          ></b-step-item>
        </b-steps>
      </div>
    </section>
  </section>
</template>

<script>
import Notification from "~/components/Notification";

export default {
  /* Guest Component to let anonymous Users on this page */
  middleware: "guest",
  data() {
    return {
      error: null,
      successMessage: null,
      /*activeStep defines initial value for b-step-item */
      activeStep: 1,
    };
  },
  mounted() {
    /* Try to confirm E-Mail if id is given as a parameter. If not given, set an error message */
    if (this.$route.query.id) {
      this.confirmEmail();
    } else {
      this.error = "Sorry, we're missing something 😅";
    }
  },
  methods: {
    /* Confirm token via Axios. If request fails, set an error message */
    async confirmEmail() {
      try {
        let res = await this.$axios
          .get(
            "/api/auth/profile/confirm-account?token=" + this.$route.query.id
          )
          .then(function (response) {
            // Set success Message
            this.successMessage = "E-Mail address successfully confirmed!";
          });
      } catch (e) {
        // Set failed Message
        this.error = "Invalid Confirmation E-Mail!";
      }
    },
  },
};
</script>
