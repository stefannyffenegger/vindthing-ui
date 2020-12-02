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
                  :disabled=!checkOwner()
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
                  :disabled=!checkOwner()
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
                  :disabled=!checkOwner()
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

              <br />

              <b-field label="New Owner">
                <b-autocomplete
                  placeholder="e.g. alex@stark-industry.com"
                  v-model="selectedSpecificUser"
                  open-on-focus
                  :disabled="checkOwner() ? false : true"
                  :data="filteredTags"
                  @typing="getFilteredTags"
                  @select="(option) => (selectedSpecificUser = option)"
                  clearable
                  max-width="300px"
                  append-to-body
                >
                </b-autocomplete>
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
                @click="
                  updateSharedUsers();
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
          <b-message
            v-for="(comment, index) in getStore.comments"
            v-bind:key="index"
            @close="deleteComment(comment.id)"
            :title="comment.user + ' | ' + comment.created"
            aria-close-label="Close message"
          >
            {{ comment.comment }}
          </b-message>

          <form method="post" @submit.prevent="createComment">
            <div class="field">
              <label class="label">Comment</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="comment"
                  v-model="commentToSend"
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
                    $buefy.toast.open({
                      message: 'New Comment created!',
                      type: 'is-success',
                      duration: 5000,
                    })
                  "
                >
                  Send Comment
                </button>
              </div>
            </div>
          </form>
        </b-tab-item>

        <b-tab-item label="Picture" v-if="this.getFocusedStoreId">
          <b-field class="file is-primary" :class="{ 'has-name': !!file }">
            <b-upload
              @input="uploadFile('store')"
              v-model="file"
              class="file-label"
            >
              <span class="file-cta">
                <b-icon class="file-icon" icon="upload"></b-icon>
                <span class="file-label">Click to upload</span>
              </span>
              <span class="file-name" v-if="file">
                {{ file.name }}
              </span>
            </b-upload>
          </b-field>
          <b-image
            v-if="!!getStore.imageId"
            :src="'http://localhost:8080/api/image/download/' + getStore.imageId + '/' + this.$auth.getToken('local').slice(6)"
            :alt="getStore.imageId"
            responsive
            ratio="6by4"
        ></b-image>

        </b-tab-item>

        <b-tab-item label="QR Code" v-if="this.getFocusedStoreId">
          <h2 class="subtitle">VindThing</h2>
          <p>Store Name: {{ form.name }}</p>
          <p>Store ID: {{ this.getFocusedStoreId }}</p>
          <br />
          <qrcode-vue
            id="qrcode"
            :value="'http://localhost:3000/stores?id=' + this.getFocusedStoreId"
            size="400"
            level="H"
          ></qrcode-vue>
          <br />
          <button @click="printElem()" class="button is-dark is-half">
            <b-icon icon="printer"></b-icon><a class="has-text-white">Print</a>
          </button>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import QrcodeVue from "qrcode.vue";

export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        location: "",
      },
      commentToSend: "",
      filteredTags: [],
      SharedUsersTags: [],
      file: null,
      searchSpecificUser: [],
      selectedSpecificUser: "",
    };
  },
  computed: {
    ...mapGetters({
      getFocusedStoreId: "stores/getFocusedStoreId",
    }),
    ...mapGetters(["loggedInUser"]),
    getStore() {
      let index = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );
      return this.$store.state.stores.stores[index];
    },
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
      this.selectedSpecificUser = this.$store.state.stores.stores[
        storeIndex
      ].owner;
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

      let userMailsFiltered = [...new Set(userMails)];

      console.log(userMailsFiltered);

      this.filteredTags = userMailsFiltered.filter((option) => {
        return (
          option.toString().toLowerCase().indexOf(text.toLowerCase()) >= 0 &&
          option.toString() !== this.loggedInUser.email
        );
      });
      console.log(this.filteredTags);
    },

    checkOwner() {
      const storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );

      return (
        this.$store.state.stores.stores[storeIndex].owner ===
        this.loggedInUser.email
      );
    },

    async updateSharedUsers() {
      let SharedUserPayload = [];
      SharedUserPayload.sharedUsers = this.SharedUsersTags;
      SharedUserPayload.storeId = this.getFocusedStoreId;
      await this.$store.dispatch("stores/updateSharedUsers", SharedUserPayload);

      const storeIndex = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );

      if (
        this.checkOwner() &&
        this.$store.state.stores.stores[storeIndex].owner !==
          this.selectedSpecificUser &&
        this.selectedSpecificUser !== ""
      ) {
        SharedUserPayload = [];
        SharedUserPayload.storeId = this.getFocusedStoreId;
        SharedUserPayload.ownerEmail = this.selectedSpecificUser;
        this.$store.dispatch("stores/updateSharedUsers", SharedUserPayload);
      }
    },
    async uploadFile(type) {
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("type", type);
      formData.append("objectId", this.getFocusedStoreId);

      this.$store.dispatch("stores/uploadFile", formData);
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
    async createComment() {
      if (this.commentToSend === "") {
        return;
      }

      let commentPayload = [];
      commentPayload.storeId = this.getFocusedStoreId;
      commentPayload.comment = this.commentToSend;
      this.$store.dispatch("stores/createComment", commentPayload);
      this.commentToSend = "";
    },

    async deleteComment(commentId) {
      console.log("hi");
      let commentPayload = [];
      commentPayload.commentId = commentId;
      commentPayload.storeId = this.getFocusedStoreId;
      this.$store.dispatch("stores/deleteComment", commentPayload);
    },
    printElem() {
      var mywindow = window.open("", "PRINT", "height=400,width=600");

      mywindow.print();

      return true;
    },
  },
  components: {
    QrcodeVue,
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
