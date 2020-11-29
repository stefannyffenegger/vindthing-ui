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
      :mobile-cards="isCardLayout"
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

      <b-table-column
        searchable
        field="name"
        label="Name"
        v-slot="props"
      >
        {{props.row.name}}
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
          <b-button type="is-primary" outlined @click="openModalStoreUpdate(props.row.id)">
            <b-tooltip label="Edit Store" type="is-primary is-light">
            <b-icon icon="pencil"></b-icon>
          </b-tooltip>
          </b-button>
          <b-button type="is-primary" outlined @click="openModalItemCreate(props.row.id)">
            <b-tooltip label="Add Item" type="is-primary is-light">
            <b-icon icon="plus"></b-icon>
            </b-tooltip>
          </b-button>
          <b-button type="is-primary" outlined @click="openModalViewtems(props.row.id)">
            <b-tooltip label="Open Store" type="is-primary is-light">
            <b-icon icon="eye"></b-icon>
              </b-tooltip>
          </b-button>
          <b-button type="is-danger" outlined @click="confirmDelete($store.state.stores.stores[props.index].name, props.row.id)">
            <b-tooltip label="Delete Store" type="is-danger is-light">
            <b-icon icon="delete"></b-icon>
            </b-tooltip>
          </b-button>
        </div>
      </b-table-column>

      <template
        slot="detail"
        slot-scope="props"
      >
        <tr class="small">
          <th></th>
          <th>Name</th>
          <th>Description</th>
          <th>Quantity</th>
          <th></th>
          <th></th>
        </tr>
        <tr v-for="item in $store.state.stores.stores[props.index].items" :key="item.id" class="small">
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
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      isComponentModalStoreActive: false,
      isComponentModalItemActive: false,
      isComponentModalViewItemsActive: false,
      isCardLayout: false
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
    }
  },
  methods: {
    async deleteStore(name, store_id) {
      this.$store.dispatch("stores/deleteStore", store_id);
      this.$buefy.toast.open(name + ' deleted!')
    },
    confirmDelete(name, id) {
      this.$buefy.dialog.confirm({
        title: 'Deleting account',
        message: 'Confirm to <b>delete</b> '+ name +'? This action cannot be undone.',
        confirmText: 'Delete '+ name,
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteStore(name, id)
      })
    },
    openModalItemCreate(storeId) {
      this.$store.dispatch("stores/setFocusedStoreId", storeId);
      this.isComponentModalItemActive = true
    },
    openModalStoreUpdate(storeId) {
      this.$store.dispatch("stores/setFocusedStoreId", storeId);
      this.isComponentModalStoreActive = true
    },
    openModalViewtems(storeId) {
      this.$store.dispatch("stores/setFocusedStoreId", storeId);
      this.isComponentModalViewItemsActive = true
    }
  },

  mounted() {
    this.$store.dispatch("stores/getStores");
  }
};
</script>
