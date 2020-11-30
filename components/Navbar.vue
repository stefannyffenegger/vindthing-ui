<template>
  <b-navbar class="is-light">
    <template slot="brand">
      <b-navbar-item>
        <nuxt-link to="/"><b-icon icon="layers-search"></b-icon> <strong>VindThing</strong></nuxt-link>
      </b-navbar-item>
    </template>

    <template slot="start">
      <b-navbar-item>
        <nuxt-link to="/chat">Chat</nuxt-link>
      </b-navbar-item>
      <b-navbar-item>
        <nuxt-link to="/stores">Stores</nuxt-link>
      </b-navbar-item>
      <b-navbar-item>
        <nuxt-link to="/statistics">Statistics</nuxt-link>
      </b-navbar-item>
    </template>

    <template slot="end">
      <template v-if="isAuthenticated">
        <b-navbar-dropdown class="is-hoverable" :label=loggedInUser.email>
          <b-navbar-item>
            <nuxt-link to="/profile">Profile</nuxt-link>
          </b-navbar-item>
          <b-navbar-item>
            <nuxt-link to="/ws-test">Websocket Tests</nuxt-link>
          </b-navbar-item>
          <hr class="navbar-divider">
          <b-navbar-item @click="logout">
            Logout
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>
      <template v-else>
        <b-navbar-item tag="div">
          <div class="buttons">
            <nuxt-link to="/register" class="button is-primary"><strong>Register</strong></nuxt-link>
            <nuxt-link to="/login" class="button is-light">Login</nuxt-link>
          </div>
        </b-navbar-item>
      </template>
    </template>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  methods: {
    async logout() {
      await this.$auth.logout();
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  }
};
</script>
