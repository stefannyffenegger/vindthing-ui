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
          <strong>E-Mail:</strong>
          {{ loggedInUser.email }}
        </p>
        <hr />
        <h2 class="subtitle">Update Profile</h2>
        <form method="post" @submit.prevent="updateProfile">
          <b-field label="New Name">
            <b-input
              type="text"
              placeholder="John Doe"
              name="name"
              v-model="form.name"
            ></b-input>
          </b-field>
          <b-field label="New Password">
            <b-input
              type="password"
              placeholder="Password"
              password-reveal
              icon="key"
              name="password"
              v-model="form.password"
            ></b-input>
          </b-field>
          <div class="control column">
            <button
              type="submit"
              class="button is-dark is-fullwidth"
              @click="
                $buefy.toast.open({
                  message: 'Profile updated!',
                  type: 'is-success',
                  duration: 5000,
                })
              "
            >
              Send Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  middleware: "auth",
  computed: {
    ...mapGetters(["loggedInUser"]),
  },
  data() {
    return {
      form: {
        name: "",
        //email: '',
        password: "",
      },
    };
  },
  methods: {
    async updateProfile() {
      let userPayload = [];
      userPayload.name = this.form.name;
      userPayload.password = this.form.password;
      this.$store.dispatch("stores/updateProfile", userPayload);
      this.form = [];
    },
  },
};
</script>
