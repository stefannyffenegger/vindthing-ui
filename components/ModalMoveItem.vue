<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Move to Store</p>
    </header>
    <div class="modal-card-body">
      <form method="post" @submit.prevent="moveItem">
        <div class="columns">
          <div class="column">
          <b-field label="Find a Store">
            <b-autocomplete
              v-model="searchSpecificStore"
              placeholder="e.g. Basement"
              open-on-focus
              :data="filteredDataObj"
              field="name"
              @select="(option) => (selected = option)"
              clearable
              max-width=300px
              append-to-body
            >
            </b-autocomplete>
          </b-field>
          </div>
        </div>

        <br>

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
              Move Item
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/* Import all Getters for Vuex Store */
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      /* Forms used in Move Store Form */
      form: {
        itemId: "",
        oldStoreId: "",
        newStoreId: "",
      },
      /* Search store via autocomplete form */
      searchSpecificStore: "",
      selected: null,
    };
  },
  computed: {
    /* Getters for Store information */
    ...mapGetters({
      getFocusedStoreId: "stores/getFocusedStoreId",
      getFocusedItemId: "stores/getFocusedItemId",
    }),
    /* Getters for Store information */
    filteredDataObj() {
      return this.$store.state.stores.stores.filter((option) => {
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(this.searchSpecificStore.toLowerCase()) >= 0
        );
      });
    },
  },

  destroyed() {
    /* Set focused Item ID to null when modal closed */
    this.$store.dispatch("stores/setFocusedItemId", null);
  },

  methods: {
    /* Move item in local store and backend */
    async moveItem() {
      if (this.getFocusedStoreId != this.form.newStoreId) {
        this.form.oldStoreId = this.getFocusedStoreId;
        this.form.newStoreId = this.selected.id;
        this.form.itemId = this.getFocusedItemId;
        this.$store.dispatch("stores/moveItem", this.form);

        // Jump into the new Store (Feature disabled. Reason: confuses enduser)
        // this.$store.dispatch("stores/setFocusedStoreId", this.form.newStoreId);

        this.form = [];
      }
    },
  },
};
</script>


<style lang="css">
.modal {
  background-color: rgba(0, 0, 0, 0.1);
}
.autocomplete .dropdown-menu {
  min-width: 300px !important;
}
</style>
