<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Stores</p>
    </header>
    <div class="modal-card-body">
      <b-tabs>
        <b-tab-item label="Erstellen">
          <form method="post" @submit.prevent="createStore">
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
              <label class="label">Location</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="location"
                  v-model="form.location"
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
                  Create Store
                </button>
              </div>
            </div>
          </form>
        </b-tab-item>

        <b-tab-item label="Permissions" v-if="this.getFocusedStoreId">
          <b-field label="Shared Users">
            <b-taginput
              v-model="SharedUsersTags"
              :data="filteredTags"
              autocomplete
              allow-new
              ellipsis
              maxlength="50"
              has-counter
              append-to-body
              :disabled="checkOwner() ? false : true"
              icon="label"
              placeholder="Add a user"
              @onclick="getFilteredTags"
              @typing="getFilteredTags"
            >
            </b-taginput>
          </b-field>

          <div class="control column">
            <button
              type="submit"
              v-show="checkOwner()"
              class="button is-dark is-fullwidth"
              @click="updateSharedUsers();$parent.close()"
            >
              Update Permissions
            </button>
          </div>
        </b-tab-item>
      </b-tabs>
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
        location: "",
      },
      filteredTags: [],
      SharedUsersTags: [],
    };
  },
  computed: {
    ...mapGetters({
      getFocusedStoreId: "stores/getFocusedStoreId",
    }),
    ...mapGetters(["loggedInUser"]),
  },

  mounted() {
    if (this.getFocusedStoreId != null) {
      var storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );

      this.form.name = this.$store.state.stores.stores[storeIndex].name;
      this.form.description = this.$store.state.stores.stores[
        storeIndex
      ].description;
      this.form.location = this.$store.state.stores.stores[storeIndex].location;

      //////////////
      // SharedUser Tab
      this.SharedUsersTags = this.$store.state.stores.stores[
        storeIndex
      ].sharedUsers;
      let ownerEmail = this.loggedInUser.email;
      this.SharedUsersTags = this.SharedUsersTags.filter(function (
        value,
        index,
        arr
      ) {
        return value !== ownerEmail;
      });
    }
  },
  destroyed() {
    this.$store.dispatch("stores/setFocusedItemId", null);
    this.$store.dispatch("stores/setFocusedStoreId", null);
    this.form = [];
  },

  methods: {
    getFilteredTags(text) {
      let userMails = this.$store.state.stores.stores
        .map((store) => {
          return store.sharedUsers;
        })
        .flat();

      const userMailsFiltered = [...new Set(userMails)];

      console.log(userMailsFiltered)

      this.filteredTags = userMailsFiltered.filter((option) => {
        return (
          option.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0
        );
      });
    },

    checkOwner() {
      const storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );

      return (
        this.$store.state.stores.stores[storeIndex].owner ==
        this.loggedInUser.email
      );
    },

    async updateSharedUsers() {
      if (this.SharedUsersTags == null) {
        return;
      }

      let SharedUserPayload = [];
      SharedUserPayload.sharedUsers = this.SharedUsersTags;
      SharedUserPayload.storeId = this.getFocusedStoreId;

      this.$store.dispatch("stores/updateSharedUsers", SharedUserPayload);
    },

    async createStore() {
      if (this.getFocusedStoreId != null) {
        this.form.storeId = this.getFocusedStoreId;
        this.$store.dispatch("stores/updateStore", this.form);
        this.form = [];
        return;
      }

      console.log(this.form);
      this.$store.dispatch("stores/createStore", this.form);
      this.form = [];
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
