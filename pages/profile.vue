<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Profile</h2>
      <div class="content">
        <p>
          <strong>Name:</strong>
          {{ loggedInUser.name }}
        </p>
        <p>
          <strong>Email:</strong>
          {{ loggedInUser.email }}
        </p>
        <hr>
        <h2 class="subtitle">Update Profile</h2>
        <form method="post" @submit.prevent="register">
          <b-field label="New Name">
            <b-input
              type="text"
              placeholder="John Doe"
              name="name"
              v-model="name"
            ></b-input>
          </b-field>
          <b-field label="New Password">
            <b-input
              type="password"
              placeholder="Password"
              password-reveal
              icon="key"
              name="password"
              v-model="password"
            ></b-input>
          </b-field>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  middleware: 'auth',
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  data() {
    return {
      name: '',
      //email: '',
      password: ''
    }
  }
}
</script>
