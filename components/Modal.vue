<template>
  <div class="container m-5">
    <h2 class="title">Stores</h2>
    <div class="content">
      <form method="post" @submit.prevent="createStore">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="name"
              v-model="form.name"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="description"
              v-model="form.description"
              required
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Location</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="location"
              v-model="form.location"
              required
            />
          </div>
        </div>
        <div class="columns">
          <div class="control column">
            <button
              @click.prevent="$parent.close()"
              class="button is-dark is-fullwidth"
            >
              Close
            </button>
          </div>
          <div class="control column">
            <button type="submit" class="button is-dark is-fullwidth"
            @click="$parent.close()">
              Create Store
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import ModalForm from "~/components/Modal";

export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        location: "",
      },
    };
  },

  methods: {
    async createStore() {
      console.log(this.form);
      this.$store.dispatch("stores/createStore", this.form);
      this.form = [];
    },
  },
};
</script>


<style lang="css" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>