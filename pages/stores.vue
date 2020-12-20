<template>
  <section class="section">
    <h2 class="title">Stores</h2>

    <button
      class="button is-black is-fullwidth"
      @click="isComponentModalStoreActive = true"
    >
      New Store
    </button>

    <b-modal trap-focus v-model="isComponentModalStoreActive">
      <LazyModalCreateStore></LazyModalCreateStore>
    </b-modal>

    <b-modal v-model="isComponentModalItemActive">
      <LazyModalCreateItem></LazyModalCreateItem>
    </b-modal>

    <b-modal full-screen v-model="isComponentModalViewItemsActive">
      <LazyModalViewItems></LazyModalViewItems>
    </b-modal>

    <hr />

    <div class="control">
      <b-switch v-model="isCardLayout">Card View</b-switch>
    </div>

    <b-table
      :data="getAllStores"
      ref="table"
      :card-layout="isCardLayout"
      :mobile-cards="true"
      hoverable
      paginated
      per-page="20"
      sort-multiple
      detailed
      custom-detail-row
      detail-key="id"
      :show-detail-icon="true"
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

      <b-table-column searchable field="name" label="Name" v-slot="props">
        <b-tooltip size="is-small" multilined type="is-primary is-light">
          <template v-slot:content>
            <p v-for="(item, index) in itemTooltip(props.row.id).slice(0, 5)" :key="index">
              {{ item }}
            </p>
          </template>
          {{ props.row.name }}
        </b-tooltip>
      </b-table-column>

      <b-table-column
        searchable
        field="description"
        label="Description"
        v-slot="props"
      >
        {{ props.row.description }}
      </b-table-column>

      <b-table-column
        searchable
        field="location"
        label="Location"
        v-slot="props"
      >
        {{ props.row.location }}
      </b-table-column>

      <b-table-column v-slot="props">
        <div class="buttons has-addons level-right">
          <b-button
            type="is-primary"
            outlined
            @click="openModalStoreUpdate(props.row.id)"
          >
            <b-tooltip label="View/Edit Store" type="is-primary is-light">
              <b-icon icon="file-eye"></b-icon>
            </b-tooltip>
          </b-button>
          <b-button
            type="is-primary"
            outlined
            @click="openModalItemCreate(props.row.id)"
          >
            <b-tooltip label="Add Item" type="is-primary is-light">
              <b-icon icon="plus"></b-icon>
            </b-tooltip>
          </b-button>
          <b-button
            type="is-primary"
            outlined
            @click="openModalViewtems(props.row.id)"
          >
            <b-tooltip label="View Items" type="is-primary is-light">
              <b-icon icon="eye"></b-icon>
            </b-tooltip>
          </b-button>
          <b-button
            type="is-danger"
            :disabled="!checkOwner(props.row.id)"
            outlined
            @click="
              confirmDelete(
                $store.state.stores.stores[props.index].name,
                props.row.id
              )
            "
          >
            <b-tooltip label="Delete Store" type="is-danger is-light">
              <b-icon icon="delete"></b-icon>
            </b-tooltip>
          </b-button>
        </div>
      </b-table-column>

      <template slot="detail" slot-scope="props">
        <tr class="small">
          <th></th>
          <th>Name</th>
          <th>Description</th>
          <th>Quantity</th>
          <th></th>
          <th></th>
        </tr>
        <tr
          v-for="item in $store.state.stores.stores[props.index].items"
          :key="item.id"
          class="small"
        >
          <td></td>
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ item.description }}
          </td>
          <td>
            {{ item.quantity }}
          </td>
          <td></td>
          <td></td>
        </tr>
      </template>
    </b-table>
  </section>
</template>

<script>
/* Import all Getters for Vuex Store */
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      /* States for Modals / button triggers event to change the boolean value */
      isComponentModalStoreActive: false,
      isComponentModalItemActive: false,
      isComponentModalViewItemsActive: false,
      isCardLayout: false,
      sliderIndex: 0,
    };
  },

  /* Force User Authentication by Import auth Module */
  middleware: "auth",
  /* Load getters to interact with Vuex Store (Stores & Auth) */
  computed: {
    ...mapGetters(["loggedInUser"]),
    ...mapGetters({
      getAllStores: "stores/getStores",
      getFocusedStoreId: "stores/getFocusedStoreId",
    }),
  },
  methods: {
    /* Dispatch delete Store Id to Vuex Actions */
    async deleteStore(storeId) {
      this.$store.dispatch("stores/deleteStore", storeId);
      this.$buefy.toast.open("Store deleted!");
    },
    /* Delete Confirmation after triggering a delete button on the page */
    confirmDelete(name, id) {
      this.$buefy.dialog.confirm({
        title: "Delete Store",
        message:
          "Confirm to <b>delete</b> " +
          name +
          "? This action cannot be undone.",
        confirmText: "Delete " + name,
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteStore(id),
      });
    },
    /* Open Create Modal and set Focues Store Id */
    async openModalItemCreate(storeId) {
      await this.$store.dispatch("stores/setFocusedStoreId", storeId);
      this.isComponentModalItemActive = true;
    },
    /* Open edit Modal and set Focues Store Id */
    async openModalStoreUpdate(storeId) {
      await this.$store.dispatch("stores/setFocusedStoreId", storeId);
      this.isComponentModalStoreActive = true;
    },
    /* Open View Items Modal */
    async openModalViewtems(storeId) {
      await this.$store.dispatch("stores/setFocusedStoreId", storeId);
      this.isComponentModalViewItemsActive = true;
    },
    /* Item tooltips when hovering over Store - Is a Requirement */
    itemTooltip(storeId) {
      const storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === storeId
      );

      let itemNames = this.$store.state.stores.stores[storeIndex].items
        .map((item) => item.name)
        .flat();

      return itemNames;
    },
    /* Check if User is Owner of a store */
    checkOwner(storeId) {
      const storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === storeId
      );

      return (
        this.$store.state.stores.stores[storeIndex].owner ===
        this.loggedInUser.email
      );
    },
  },
  mounted() {
    /* Get all stores where the User is an owner / or a shared user */
    this.$store.dispatch("stores/getStores");
    if (this.$route.query.id) {
      this.openModalViewtems(this.$route.query.id);
    }
  },
};
</script>
