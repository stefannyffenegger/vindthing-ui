<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Store</p>
    </header>
    <div class="modal-card-body">
      <b-tabs>
        <b-tab-item label="Edit">
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
              <div class="control column" v-if="!this.getFocusedStoreId">
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
              <div class="control column" v-if="this.getFocusedStoreId">
                <button
                  type="submit"
                  class="button is-dark is-fullwidth"
                  @click="
                    $parent.close();
                    $buefy.toast.open({
                      message: 'Store updated!',
                      type: 'is-success',
                      duration: 5000,
                    });
                  "
                >
                  Update Store
                </button>
              </div>
            </div>
          </form>
        </b-tab-item>

        <b-tab-item label="Share" v-if="this.getFocusedStoreId">
          <div class="columns">
            <div class="column">
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
                v-show="checkOwner()"
                class="button is-dark is-fullwidth"
                @click="updateSharedUsers();
                $parent.close();
                $buefy.toast.open({
                  message: 'Store permissions updated!',
                  type: 'is-success',
                  duration: 5000,
                });
                "
              >
                Update Permissions
              </button>
            </div>
          </div>
        </b-tab-item>

        <b-tab-item label="Comment" v-if="this.getFocusedStoreId">
          <b-message title="bob@bob 2020-11-26" aria-close-label="Close message">
            Sorry, broke the toaster, will bring a new one tomorrow
          </b-message>
          <b-message title="bob@bob 2020-11-28" aria-close-label="Close message">
            Took the green socks
          </b-message>
        </b-tab-item>

        <b-tab-item label="Picture" v-if="this.getFocusedStoreId">
          <b-field>
            <b-upload v-model="dropFiles"
                      multiple
                      drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon
                      icon="upload"
                      size="is-large">
                    </b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>

          <div class="tags">
            <span v-for="(file, index) in dropFiles"
                  :key="index"
                  class="tag is-primary">
                {{ file.name }}
                <button class="delete is-small"
                        type="button"
                        @click="deleteDropFile(index)">
                </button>
            </span>
          </div>
        </b-tab-item>

        <b-tab-item label="QR Code" v-if="this.getFocusedStoreId">
          <h2 class="subtitle">VindThing</h2>
          <p>Store Name: {{ form.name }}</p>
          <p>Store ID: {{ this.getFocusedStoreId }}</p>
          <br>
          <qrcode-vue id="qrcode" :value="this.getFocusedStoreId" size="400" level="H"></qrcode-vue>
          <button
            @click="printElem()"
            class="button is-dark is-fullwidth"
          >
            Print
          </button>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters} from "vuex";
import QrcodeVue from 'qrcode.vue';

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
      dropFiles: [],
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
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1)
    },
    printElem() {
      var mywindow = window.open('', 'PRINT', 'height=400,width=600');

      mywindow.document.write('<p>Halloo</p>');
      mywindow.document.write(document.getElementById("qrcode").get(0));
      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      //mywindow.close();

      return true;
    }
  },
  components: {
    QrcodeVue,
  }
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
