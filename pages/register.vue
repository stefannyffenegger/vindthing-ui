<template>
  <section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-4 is-offset-4">
            <h2 class="title has-text-centered">Register!</h2>

            <Notification :message="error" v-if="error" />
            <ValidationObserver v-slot="{ invalid }">
              <form method="post" @submit.prevent="register">
                <validation-provider
                  rules="required|alpha_dash"
                  v-slot="{ errors }"
                >
                  <!-- v-bind:type="{'is-danger':(!!errors[0])}" -->
                  <b-field
                    label="Name"
                    v-bind:type="{ 'is-danger': !!errors[0] }"
                  >
                    <b-input
                      name="name"
                      v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                      v-model="name"
                      required
                      validation-message="Not a valid Name"
                      maxlength="30"
                    ></b-input>
                  </b-field>
                </validation-provider>

                <validation-provider rules="required|email" v-slot="{ errors }">
                  <b-field
                    label="E-Mail"
                    v-bind:type="{ 'is-danger': !!errors[0] }"
                  >
                    <b-input
                      type="email"
                      placeholder="E-Mail"
                      v-bind:icon="!!errors[0] ? 'email' : 'check-circle'"
                      name="username"
                      v-model="email"
                      maxlength="40"
                      required
                      validation-message="Not a valid E-Mail address"
                    ></b-input>
                  </b-field>
                </validation-provider>

                <validation-provider
                  rules="required|password:@confirm"
                  v-slot="{ errors }"
                >
                  <b-field
                    label="Password"
                    v-bind:type="{ 'is-danger': !!errors[0] }"
                  >
                    <b-input
                      type="password"
                      placeholder="Password"
                      password-reveal
                      v-bind:icon="!!errors[0] ? 'key' : 'check-circle'"
                      name="password"
                      maxlength="40"
                      v-model="password"
                      validation-message="Not a valid Password"
                      required
                    ></b-input>
                  </b-field>
                  <span class="help is-danger">{{ errors[0] }}</span>
                </validation-provider>

                <validation-provider
                  name="confirm"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <b-field
                    label="Confirm Password"
                    v-bind:type="{ 'is-danger': !!errors[0] }"
                  >
                    <b-input
                      type="password"
                      placeholder="Password"
                      password-reveal
                      v-bind:icon="!!errors[0] ? 'key' : 'check-circle'"
                      name="password"
                      maxlength="40"
                      v-model="confirmation"
                    ></b-input>
                  </b-field>
                  <span class="help is-danger">{{ errors[0] }}</span>
                </validation-provider>

                <br />

                <div class="control">
                  <button type="submit" class="button is-dark is-fullwidth" :disabled="invalid">
                    Register
                  </button>
                </div>
              </form>
            </ValidationObserver>

            <div class="has-text-centered" style="margin-top: 20px">
              Already got an account?
              <nuxt-link to="/login">Login</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section has-background-white-bis">
      <div class="container">
        <h2 class="subtitle has-text-primary">Getting Started</h2>
        <b-steps size="is-medium">
          <b-step-item label="Register" icon="account-plus" :clickable="true">
            <hr />
            <h2 class="subtitle">Register</h2>
            <p>Register an account with the form on this page</p>
          </b-step-item>
          <b-step-item
            label="Confirm Email"
            icon="email-check"
            :clickable="true"
          >
            <hr />
            <h2 class="subtitle">Confirm Email</h2>
            <p>You will get an email with a link to confirm your account</p>
            <p>As soon as you confirm your account, it gets unlocked</p>
          </b-step-item>
          <b-step-item label="Login" icon="account-key" :clickable="true">
            <hr />
            <h2 class="subtitle">Login</h2>
            <p>
              Welcome to Vindthing! now you can
              <nuxt-link to="/login">Login</nuxt-link>
              with your credentials
            </p>
          </b-step-item>
        </b-steps>
      </div>
    </section>
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
  message: "This field is required",
});
extend("email", email);
extend("alpha_dash", alpha_dash);
extend("alpha_num", alpha_num);

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});

//////////////////////////////////////////
//////////////////////////////////////////



export default {
  /* Guest Component to let anonymous Users on this page */
  middleware: "guest",
  components: {
    Notification,
    ValidationProvider, // Form Validation
    ValidationObserver // Form Validation
  },

  data() {
    return {
      /* Register Form data, used in the register method */
      name: "",
      email: "",
      password: "",
      confirmation: "",
      error: null,
    };
  },

  methods: {
    /* Sends data directly via Axios to the VindThing Backend */
    async register() {
      try {
        await this.$axios.post("/api/auth/signup", {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        this.$router.push("/registered");
      } catch (e) {
        /* Log error to Notification Component - Bar on top of Register field  */
        this.error = e.response.data.message;
      }
    },
  },
};
</script>
