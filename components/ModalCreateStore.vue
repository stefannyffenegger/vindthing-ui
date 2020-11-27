<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Stores</p>
    </header>
    <div class="modal-card-body">
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
            <button
              type="submit"
              class="button is-dark is-fullwidth"
              @click="
                $parent.close();
                $buefy.toast.open({
                  message: 'New Store created!',
                  type: 'is-success',
                  duration: 5000,
                });
              "
            >
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
  computed: mapGetters({
    getFocusedStoreId: "stores/getFocusedStoreId",
  }),

  mounted() {
    if (this.getFocusedStoreId != null) {
      const storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );

      this.form.name = this.$store.state.stores.stores[storeIndex].name;
      this.form.description = this.$store.state.stores.stores[
        storeIndex
      ].description;
      this.form.location = this.$store.state.stores.stores[storeIndex].location;
    }
  },
  destroyed() {
    this.$store.dispatch("stores/setFocusedItemId", null);
    this.$store.dispatch("stores/setFocusedStoreId", null);
  },

  methods: {
    async createStore() {
      if (this.getFocusedStoreId != null) {
        this.form.storeId = this.getFocusedStoreId;
        this.$store.dispatch("stores/updateStore", this.form);
        this.form = [];
        return;
      }

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
