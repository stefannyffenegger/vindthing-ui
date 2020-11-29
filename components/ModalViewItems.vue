<template>
  <section class="section">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Items of {{this.getStore.name}}</p>
      </header>
      <div class="modal-card-body">
        <button
          class="button is-dark is-fullwidth"
          @click="isComponentModalItemActive = true"
        >
          New Item
        </button>

        <b-modal v-model="isComponentModalItemActive">
          <LazyModalCreateItem></LazyModalCreateItem>
        </b-modal>

        <b-modal v-model="isComponentModalMoveItem">
          <LazyModalMoveItem></LazyModalMoveItem>
        </b-modal>

        <hr/>

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

          <b-table-column searchable field="name" label="Name" v-slot="props">{{
              props.row.name
            }}
          </b-table-column>

          <b-table-column
            searchable
            field="description"
            label="Description"
            v-slot="props"
          >{{ props.row.description }}
          </b-table-column
          >

          <b-table-column
            searchable
            field="quantity"
            label="Quantity"
            v-slot="props"
          >{{ props.row.location }}
          </b-table-column
          >

          <b-table-column
            field="usage"
            label="Usage"
            v-slot="props">
            {{ props.row.useCount }}
          </b-table-column>

          <b-table-column label="In Store" v-slot="props">
            <b-switch :value="props.row.inStore" type="is-primary" passive-type="is-dark"
                      @click.native="incrementCounter(props.row)"></b-switch>
          </b-table-column>

          <b-table-column v-slot="props">

            <div class="buttons has-addons level-right">
              <b-button type="is-primary" outlined @click="updateItem(props.row)">
                <b-icon icon="pencil"></b-icon>
              </b-button>
              <b-button type="is-primary" outlined @click="moveItem(props.row)">
                <b-icon icon="redo"></b-icon>
              </b-button>
              <b-button type="is-danger" outlined @click="deleteItem(props.row)">
                <b-icon icon="delete"></b-icon>
              </b-button>
            </div>
          </b-table-column>

        </b-table>
      </div>
    </div>
  </section>
</template>

<script>
import {mapMutations, mapGetters} from "vuex";

export default {
  data() {
    return {
      isComponentModalItemActive: false,
      isComponentModalMoveItem: false,
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
      const index = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );
      return this.$store.state.stores.stores[index].items;
    },
    getStore(){
      let index = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );
      return this.$store.state.stores.stores[index];
    },
  },

  destroyed() {
    this.$store.dispatch("stores/setFocusedItemId", null);
    this.$store.dispatch("stores/setFocusedStoreId", null);
    this.form = [];
  },
  methods: {
    async incrementCounter(item) {
      let payloadCounter = [];
      payloadCounter.storeId = this.getFocusedStoreId;
      payloadCounter.itemId = item.id;
      payloadCounter.inStore = !item.inStore;

      this.$store.dispatch("stores/incrementCounter", payloadCounter);
    },
    async deleteItem(item) {
      item.storeId = this.getFocusedStoreId;
      this.$store.dispatch("stores/deleteItem", item);
    },
    async updateItem(item) {
      this.$store.dispatch("stores/setFocusedItemId", item.id);
      this.isComponentModalItemActive = true;
    },
    async moveItem(item) {
      this.$store.dispatch("stores/setFocusedItemId", item.id);
      this.isComponentModalMoveItem = true;
    },
  },
};
</script>
