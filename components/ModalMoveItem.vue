<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Move to Store</p>
    </header>
    <div class="modal-card-body">
      <form method="post" @submit.prevent="moveItem">
        <div>
          <b-field label="Find a Store">
            <b-autocomplete
              v-model="searchSpecificStore"
              placeholder="e.g. Basement"
              :open-on-focus="true"
              :data="filteredDataObj"
              field="name"
              @select="(option) => (selected = option)"
              :clearable="true"
              append-to-body
              max-height=300px
            >
            </b-autocomplete>
          </b-field>
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
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        oldStoreId: "",
        newStoreId: "",
      },
      searchSpecificStore: "",
      selected: null,
    };
  },
  computed: {
    ...mapGetters({
      getFocusedStoreId: "stores/getFocusedStoreId",
    }),
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

  mounted() {},
  destroyed() {
    this.$store.dispatch("stores/setFocusedItemId", null);
  },

  methods: {
    async moveItem() {
      if (this.getFocusedStoreId != form.newStoreId) {
        this.form.oldStoreId = this.getFocusedStoreId;
        this.$store.dispatch("stores/moveItem", this.form);
        this.form = [];
        this.$store.dispatch("stores/setFocusedStoreId", form.newStoreId);
      }
    },
  },
};
</script>


<style lang="css" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
