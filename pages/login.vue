<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>

          <Notification :message="error" v-if="error" />

          <ValidationObserver v-slot="{ invalid }">
            <form method="post" @submit.prevent="login">
              <validation-provider
              rules="required|email"
              v-slot="{ errors }">
                <b-field
                  label="E-Mail"
                  v-bind:type="{ 'is-danger': !!errors[0] }"
                >
                  <b-input
                    type="email"
                    placeholder="E-Mail"
                    name="email"
                    v-bind:icon="!!errors[0] ? 'email' : 'check-circle'"
                    v-model="email"
                    required
                    validation-message="Not a valid E-Mail address"
                    maxlength="50"
                  ></b-input>
                </b-field>
              </validation-provider>

              <validation-provider
                rules="required"
                v-slot="{ errors }"
              >
                <b-field label="Password">
                  <b-input
                    type="password"
                    placeholder="Password"
                    password-reveal
                    v-bind:icon="!!errors[0] ? 'key' : 'check-circle'"
                    name="password"
                    maxlength="64"
                    v-model="password"
                    validation-message="Not a valid Password"
                    required
                  ></b-input>
                </b-field>
              </validation-provider>
              <br />

              <div class="control">
                <button
                  type="submit"
                  class="button is-dark is-fullwidth"
                  :disabled="invalid"
                >
                  Log In
                </button>
              </div>
            </form>
          </ValidationObserver>
          <div class="has-text-centered" style="margin-top: 20px">
            <p>
              Don't have an account?
              <nuxt-link to="/register">Register</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from "~/components/Notification";

//////////////////////////////////////////
// Form Validation
//////////////////////////////////////////
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import {
  required,
  email,
  alpha_dash,
  alpha_num,
} from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required - Bensch",
});
extend("email", email);
extend("alpha_dash", alpha_dash);
extend("alpha_num", alpha_num);
//////////////////////////////////////////
//////////////////////////////////////////

export default {
  /* Guest Component to let anonymous Users on this page */
  middleware: "guest",

  components: {
    Notification,
    ValidationProvider, // Form Validation
    ValidationObserver, // Form Validation
  },

  data() {
    return {
      /* Form data for User Login*/
      email: "",
      password: "",
      error: null,
    };
  },

  methods: {
    /* Login triggers Auth module to send an axios request, if successfull, token and user profile data gets saved in Vuex Store */
    async login() {
      try {
        await this.$auth.loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
          },
        });

      } catch (e) {
        /* Log error to Notification Component - Bar on top of Register field  */
        this.error = e.response.data.message;
      }
    },
  },
};
</script>
