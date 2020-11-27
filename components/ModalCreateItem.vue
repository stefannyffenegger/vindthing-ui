<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Item</p>
    </header>
    <div class="modal-card-body">
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
            <button v-if="getFocusedItemId" type="submit" class="button is-dark is-fullwidth" @click="$parent.close()">Update Item</button>
            <button v-else type="submit" class="button is-dark is-fullwidth" @click="$parent.close()">Create Item</button>
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
    getFocusedItemId: "stores/getFocusedItemId",
  }),

  mounted() {
    if (this.getFocusedItemId != null) {
        const storeIndex = this.$store.state.stores.stores.findIndex(store => store.id === this.getFocusedStoreId );
        const itemIndex = this.$store.state.stores.stores[storeIndex].items.findIndex(itemInStore => itemInStore.id === this.getFocusedItemId );
        
        this.form.name = this.$store.state.stores.stores[storeIndex].items[itemIndex].name
        this.form.description = this.$store.state.stores.stores[storeIndex].items[itemIndex].description
        this.form.quantity = this.$store.state.stores.stores[storeIndex].items[itemIndex].quantity
    }
  },
  destroyed() {
    this.$store.dispatch("stores/setFocusedItemId", null);
  },

  methods: {
    async createItem() {
      if (this.getFocusedItemId != null) {
        this.form.storeId = this.getFocusedStoreId;
        this.form.itemId = this.getFocusedItemId;
        this.$store.dispatch("stores/updateItem", this.form);
        this.form = [];
        return
      }

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