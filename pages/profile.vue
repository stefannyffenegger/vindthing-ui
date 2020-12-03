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

        <ValidationObserver v-slot="{ invalid }">
          <form method="post" @submit.prevent="updateProfile">
            <validation-provider
              rules="required|alpha_dash"
              v-slot="{ errors }"
            >
              <b-field
                label="New Name"
                v-bind:type="{ 'is-danger': !!errors[0] }"
              >
                <b-input
                  placeholder="John Doe"
                  name="name"
                  v-bind:icon="!!errors[0] ? 'email' : 'check-circle'"
                  v-model="form.name"
                  required
                  validation-message="Not a valid Name"
                  maxlength="30"
                ></b-input>
              </b-field>
            </validation-provider>

            <validation-provider rules="required|alpha_num" v-slot="{ errors }">
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
                  v-model="form.password"
                  validation-message="Not a valid Password"
                  required
                ></b-input>
              </b-field>
            </validation-provider>
            <br />

            <div class="control column">
              <button
                type="submit"
                class="button is-dark is-fullwidth"
                :disabled="invalid"
                @click="
                  $buefy.toast.open({
                    message: 'Profile updated!',
                    type: 'is-success',
                    duration: 5000,
                  })
                "
              >
                Update Profile
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

/////////////////////
// Form Validation
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
/////////////////////

export default {
  middleware: "auth",
  components: {
    ValidationProvider, // Form Validation
    ValidationObserver, // Form Validation
  },
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
