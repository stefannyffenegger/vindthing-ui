<template>
  <section class="section">
    <h2 class="title">Stores</h2>

    <button
      class="button is-dark is-fullwidth"
      @click="isComponentModalActive = true"
    >
      New Store
    </button>

    <b-modal v-model="isComponentModalActive">
      <LazyModal></LazyModal>
    </b-modal>

    <hr />

    <div class="control">
      <b-switch v-model="isCardLayout"
        >Card View</b-switch
      >
    </div>

    <b-table
      :data="getAllStores"
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
        field="location"
        label="Location"
        v-slot="props"
        >{{ props.row.location }}</b-table-column
      >

      <b-table-column label="Delete" v-slot="props">
        <b-button @click="deleteStore(props.row.id)">Delete</b-button>
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import ModalForm from "~/components/Modal";

export default {
  data() {
    return {
      isComponentModalActive: false,
      isCardLayout: false
    };
  },

  middleware: "auth",
  computed: {},
  computed: mapGetters({
    getAllStores: "stores/getStores",
  }),
  methods: {
    async deleteStore(store_id) {
      this.$store.dispatch("stores/deleteStore", store_id);
    },
    openModal() {
      this.modalOpen = !this.modalOpen;
    },
  },

  mounted() {
    this.$store.dispatch("stores/getStores");
  },
};
</script>
