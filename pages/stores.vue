<template>
  <section class="section">
    <div class="container">
      <h2 class="title">Stores</h2>
      <div class="content">
        <form method="post" @submit.prevent="createStore">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input type="text" class="input" name="name" v-model="form.name" required />
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
            <label class="label">Location</label>
            <div class="control">
              <input type="text" class="input" name="location" v-model="form.location" required />
            </div>
          </div>
          <div class="control">
            <button type="submit" class="button is-dark is-fullwidth">Create Store</button>
          </div>
        </form>
      </div>
    </div>

    <hr />

    <b-table :data="getAllStores">
      <template v-if="column.searchable && !column.numeric" slot="searchable" slot-scope="props">
        <b-input
          v-model="props.filters[props.column.field]"
          placeholder="Search..."
          icon="magnify"
          size="is-small"
        />
      </template>

      <b-table-column field="id" label="ID" width="40" numeric v-slot="props">{{ props.row.id }}</b-table-column>

      <b-table-column
        searchable
        field="name"
        label="Name"
        v-slot="props"
      >{{ props.row.name }}</b-table-column>

      <b-table-column
        searchable
        field="description"
        label="Description"
        v-slot="props"
      >{{ props.row.description }}</b-table-column>

      <b-table-column
        searchable
        field="location"
        label="Location"
        v-slot="props"
      >{{ props.row.location }}</b-table-column>

      <b-table-column label="Delete" v-slot="props">
        <b-button @click="deleteStore(props.row.id)">Delete</b-button>
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        location: ""
      }
    };
  },

  middleware: "auth",
  computed: {},
  computed: mapGetters({
    getAllStores: "stores/getStores"
  }),
  methods: {
    async deleteStore(store_id) {
      this.$store.dispatch("stores/deleteStore", store_id);
    },
    async createStore() {
      console.log(this.form);
      this.$store.dispatch("stores/createStore", this.form);
      this.form = [];
    }
  },

  mounted() {
    this.$store.dispatch("stores/getStores");
  }
};
</script>
