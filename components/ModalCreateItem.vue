/* Component used in for Stores Page */

<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Item</p>
    </header>
    <div class="modal-card-body">

          <ValidationObserver v-slot="{ invalid }">
            <form method="post" @submit.prevent="createItem">
              <validation-provider
                :rules="{
                  required: true,
                  regex: /^[a-zA-Z0-9_@./#&;:+-äÄöÖüÜ ]*$/
                }"
                v-slot="{ errors }"
              >
                <b-field
                  label="Name"
                  v-bind:type="{ 'is-danger': !!errors[0] }"
                >
                  <b-input
                    placeholder="Toys, Books, ..."
                    name="name"
                    v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                    v-model="form.name"
                    required
                    type="text"
                    validation-message="Not a valid Name"
                    maxlength="50"
                  ></b-input>
                </b-field>
              </validation-provider>

              <validation-provider
                :rules="{
                  required: true
                }"
                v-slot="{ errors }"
              >
                <b-field
                  label="Description"
                  v-bind:type="{ 'is-danger': !!errors[0] }"
                >
                  <b-input
                    placeholder="Description"
                    name="description"
                    v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                    v-model="form.description"
                    required
                    type="text"
                    validation-message="Not a valid Description"
                    maxlength="250"
                  ></b-input>
                </b-field>
              </validation-provider>

              <validation-provider
                :rules="{
                  required: true,
                  regex: /^[0-9]*$/
                }"
                v-slot="{ errors }"
              >
                <b-field
                  label="Quantity"
                  v-bind:type="{ 'is-danger': !!errors[0] }"
                >
                  <b-input
                    placeholder="Number..."
                    name="quantity"
                    v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                    v-model="form.quantity"
                    required
                    type="number"
                    validation-message="Not a valid Number"
                    maxlength="50"
                  ></b-input>
                </b-field>
              </validation-provider>

              <div class="columns">
                <div class="control column">
                  <button
                    @click.prevent="$parent.close()"
                    class="button is-dark is-fullwidth"
                  >
                    Close
                  </button>
                </div>
                <div class="control column" v-if="!getFocusedItemId">
                  <button
                    type="submit"
                    class="button is-dark is-fullwidth"
                    :disabled="invalid"
                    @click="
                      $parent.close();
                      $buefy.toast.open({
                        message: 'New Item created!',
                        type: 'is-success',
                        duration: 5000,
                      });
                    "
                  >
                    Create Item
                  </button>
                </div>
                <div class="control column" v-else>
                  <button
                    type="submit"
                    class="button is-dark is-fullwidth"
                    :disabled="invalid"
                    @click="
                      $parent.close();
                      $buefy.toast.open({
                        message: 'Item updated!',
                        type: 'is-success',
                        duration: 5000,
                      });
                    "
                  >
                    Update Item
                  </button>
                </div>
              </div>
            </form>
          </ValidationObserver>

    </div>
  </div>
</template>

<script>
/* Import all Getters for Vuex Store */
import { mapMutations, mapGetters } from "vuex";

/////////////////////
// Form Validation
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import {
  required,
  email,
  regex,
} from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required",
});
extend("email", email);
extend("regex", regex);
/////////////////////

export default {
  components: {
    /* Load Validation Component */
    ValidationProvider, // Form Validation
    ValidationObserver, // Form Validation
  },

  data() {
    return {
      /* States for Item Form */
      form: {
        name: "",
        description: "",
        quantity: "",
      }
    };
  },
  /* Load getters to interact with Vuex Store (Stores) */
  computed: {
    ...mapGetters({
      getFocusedItemId: "stores/getFocusedItemId",
      getFocusedStoreId: "stores/getFocusedStoreId",
    }),
  },

  mounted() {
    /* Sets the default content when in edit mode */
    if (this.getFocusedItemId != null) {
      const storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );
      const itemIndex = this.$store.state.stores.stores[storeIndex].items.findIndex(
        (itemInStore) => itemInStore.id === this.getFocusedItemId
      );

      this.form.name = this.$store.state.stores.stores[storeIndex].items[
        itemIndex
      ].name;
      this.form.description = this.$store.state.stores.stores[storeIndex].items[
        itemIndex
      ].description;
      this.form.quantity = this.$store.state.stores.stores[storeIndex].items[
        itemIndex
      ].quantity;

    }
  },
  destroyed() {
    /* Set focus Item ID to null if closed or item added/updated */
    this.$store.dispatch("stores/setFocusedItemId", null);
    this.form = [];
  },

  methods: {
    /* Creates Item via dispatch method */
    async createItem() {
      if (this.getFocusedItemId != null) {
        this.form.storeId = this.getFocusedStoreId;
        this.form.itemId = this.getFocusedItemId;
        this.form.inStore = this.getItem().inStore;
        
        this.$store.dispatch("stores/updateItem", this.form);
        return;
      }

      this.form.storeId = this.getFocusedStoreId;
      this.$store.dispatch("stores/createItem", this.form);
    },
    /* Gets Item if in edit mode */
    getItem() {
      const storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );
      const itemIndex = this.$store.state.stores.stores[storeIndex].items.findIndex(
        (itemInStore) => itemInStore.id === this.getFocusedItemId
      );
      return this.$store.state.stores.stores[storeIndex].items[itemIndex];
    },
  },
};
</script>


<style lang="css" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>