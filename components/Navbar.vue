<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <nuxt-link class="navbar-brand mb-0 h1" to="/">VindThing</nuxt-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <nuxt-link class="nav-link" to="/">Home</nuxt-link>
        </li>
        <template v-if="isAuthenticated">
          <li class="nav-item active">
            <nuxt-link class="nav-link" to="/chat">Chat</nuxt-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >{{ loggedInUser.email }}</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <nuxt-link class="dropdown-item" to="/profile">My Profile</nuxt-link>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" @click="logout">Logout</a>
            </div>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/register">Register</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/login">Login</nuxt-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
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