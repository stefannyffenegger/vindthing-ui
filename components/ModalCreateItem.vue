<template>
  <div class="container m-5">
    <h2 class="title">Item</h2>
    <div class="content">
      <form method="post" @submit.prevent="createItem">
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
          <label class="label">Quantity</label>
          <div class="control">
            <input
              type="text"
              class="input"
              name="quantity"
              v-model="form.quantity"
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
              Create Item
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
        quantity: "",
      },
    };
  },
  computed: mapGetters({
    getFocusedStoreId: "stores/getFocusedStoreId",
  }),
  methods: {
    async createItem() {
      this.form.storeId = this.getFocusedStoreId;
      this.$store.dispatch("stores/createItem", this.form);
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