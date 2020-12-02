<template>
  <section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-4 is-offset-4">
            <h2 class="title has-text-centered">Register!</h2>

            <Notification :message="error" v-if="error"/>

            <form method="post" @submit.prevent="register">
              <b-field label="Name">
                <b-input
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  v-model="name"
                  required
                ></b-input>
              </b-field>
              <b-field label="E-Mail">
                <b-input
                  type="email"
                  placeholder="Email"
                  icon="email"
                  name="username"
                  v-model="email"
                  required
                ></b-input>
              </b-field>
              <b-field label="Password">
                <b-input
                  type="password"
                  placeholder="Password"
                  password-reveal
                  icon="key"
                  name="password"
                  v-model="password"
                  required
                ></b-input>
              </b-field>
              <div class="control">
                <button type="submit" class="button is-dark is-fullwidth">Register</button>
              </div>
            </form>

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
          <b-step-item
            label="Register"
            icon="account-plus"
            :clickable=true
          >
            <hr>
            <h2 class="subtitle">Register</h2>
            <p>Register an account with the form on this page</p>
          </b-step-item>
          <b-step-item
            label="Confirm Email"
            icon="email-check"
            :clickable=true
          >
            <hr>
            <h2 class="subtitle">Confirm Email</h2>
            <p>You will get an email with a link to confirm your account</p>
            <p>As soon as you confirm your account, it gets unlocked</p>
          </b-step-item>
          <b-step-item
            label="Login"
            icon="account-key"
            :clickable=true
          >
            <hr>
            <h2 class="subtitle">Login</h2>
            <p>Welcome to Vindthing! now you can
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
import Notification from '~/components/Notification'

export default {
  middleware: 'guest',
  components: {
    Notification,
  },

  data() {
    return {
      name: '',
      email: '',
      password: '',
      error: null
    }
  },

  methods: {
    async register() {
      try {
        await this.$axios.post('/api/auth/signup', {
          name: this.name,
          email: this.email,
          password: this.password
        });

        /*await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          },
        });*/

        await this.$router.push('/registered');
      } catch (e) {
        this.error = e.response.data.message
      }
    }
  }
}
</script>
