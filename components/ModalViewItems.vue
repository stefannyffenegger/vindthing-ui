<template>
  <section class="section">
    <h2 class="title">Items</h2>

    <button
      class="button is-dark is-fullwidth"
      @click="isComponentModalItemActive = true"
    >
      New Item
    </button>

    <b-modal v-model="isComponentModalItemActive">
      <LazyModalCreateItem></LazyModalCreateItem>
    </b-modal>

    <hr />

    <div class="control">
      <b-switch v-model="isCardLayout">Card View</b-switch>
    </div>

    <b-table
      :data="this.getItems"
      :card-layout="isCardLayout"
      :mobile-cards="isCardLayout"
      hoverable
      checkable
      paginated
      per-page="10"
      sort-multiple
    >
      <template
        v-if="column.searchable && !column.numeric"
        slot="searchable"
        slot-scope="props"
      >
        <b-input
          v-model="props.filters[props.column.field]"
          placeholder="Search..."
          icon="magnify"
          size="is-small"
        />
      </template>

      <b-table-column field="id" label="ID" width="40" numeric v-slot="props">{{
        props.row.id
      }}</b-table-column>

      <b-table-column searchable field="name" label="Name" v-slot="props">{{
        props.row.name
      }}</b-table-column>

      <b-table-column
        searchable
        field="description"
        label="Description"
        v-slot="props"
        >{{ props.row.description }}</b-table-column
      >

      <b-table-column
        searchable
        field="quantity"
        label="Quantity"
        v-slot="props"
        >{{ props.row.location }}</b-table-column
      >

      <b-table-column label="Delete" v-slot="props">
        <b-button @click="deleteItem(props.row)">Delete</b-button>
      </b-table-column>

    </b-table>
  </section>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      isComponentModalItemActive: false,
      isCardLayout: false,
    };
  },
  middleware: "auth",

  computed: {
    ...mapGetters({
      getAllStores: "stores/getStores",
      getFocusedStoreId: "stores/getFocusedStoreId",
    }),
    getItems() {
        const index = this.$store.state.stores.stores.findIndex(store => store.id === this.getFocusedStoreId );
        return this.$store.state.stores.stores[index].items
    },
  },
  methods: {
    async deleteItem(item) {
      item.storeId = this.getFocusedStoreId
      this.$store.dispatch("stores/deleteItem", item);
    },
    openModalItemCreate(storeId) {
      this.$store.dispatch("stores/setFocusedStoreId", storeId);
      this.isComponentModalItemActive = true
    },
  },

};
</script>
