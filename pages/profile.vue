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
              :rules="!form.password ? {required: true, regex:/^[a-zA-Z0-9_@./#&;:+-äÄöÖüÜ ]*$/} : {regex: /^[a-zA-Z0-9_@./#&;:+-äÄöÖüÜ ]*$/}"
              v-slot="{ errors }"
            >
              <b-field
                label="New Name"
                v-bind:type="{ 'is-danger': !!errors[0] }"
              >
                <b-input
                  placeholder="John Doe"
                  name="name"
                  v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                  v-model="form.name"
                  validation-message="Not a valid Name"
                  maxlength="50"
                ></b-input>
              </b-field>
              <span class="help is-danger">{{ errors[0] }}</span>
            </validation-provider>

            <validation-provider
              name="password"
              :rules="`${!form.name ? 'required|password:@confirm' : 'password:@confirm'}`"
              v-slot="{ errors }"
            >
              <b-field
                label="New Password"
                v-bind:type="{ 'is-danger': !!errors[0] }"
              >
                <b-input
                  type="password"
                  placeholder="Password"
                  password-reveal
                  v-bind:icon="!!errors[0] ? 'key' : 'check-circle'"
                  name="password"
                  maxlength="64"
                  v-model="form.password"
                  validation-message="Not a valid Password"
                ></b-input>
              </b-field>
              <span class="help is-danger">{{ errors[0] }}</span>
            </validation-provider>

            <validation-provider
              name="confirm"
              rules="password:@password"
              v-slot="{ errors }"
            >
              <b-field
                label="Confirm new Password"
                v-bind:type="{ 'is-danger': !!errors[0] }"
              >
                <b-input
                  type="password"
                  placeholder="Password"
                  password-reveal
                  v-bind:icon="!!errors[0] ? 'key' : 'check-circle'"
                  name="password"
                  maxlength="64"
                  v-model="confirmation"
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
/* Import Vuex Getter */
import { mapGetters } from "vuex";

//////////////////////////////////////////
// Form Validation
//////////////////////////////////////////
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import {
  required,
  email,
  regex,
  alpha_dash,
  alpha_num,
} from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "One of this fields is required",
});
extend("email", email);
extend("alpha_dash", alpha_dash);
extend("alpha_num", alpha_num);
extend("regex", regex);

extend("password", {
  params: ["target"],
  validate(value, { target }) {
    return value === target;
  },
  message: "Password confirmation does not match",
});
//////////////////////////////////////////
//////////////////////////////////////////

export default {
  /* Force User Authentication by Import auth Module */
  middleware: "auth",
  /* Component for the Validation Provider */
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  /* Getter for Vuex logged in User Account */
  computed: {
    ...mapGetters(["loggedInUser"]),
  },
  data() {
    return {
      /* Password confirmation field */
      confirmation: "",

      regexDruck: "/^[a-zA-Z0-9_@./#&;:+-äÄöÖüÜ ]*$/",

      /* Form to send updates later in updateProfile Method */
      form: {
        name: "",
        //email: '',
        password: "",
      },
    };
  },
  methods: {
    /* Send an update with dispatch Method to Vuex Store - Action & Commit */
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
