<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Store</p>
    </header>
    <div class="modal-card-body">
      <b-tabs>
        <b-tab-item label="Edit">
          <ValidationObserver v-slot="{ invalid }">
            <form method="post" @submit.prevent="createStore">
              <validation-provider
                :rules="{
                  required: true,
                  regex: /^[a-zA-Z0-9_@./#&;:+-äÄöÖüÜ ]*$/
                }"
                v-slot="{ errors }"
              >
                <b-field
                  label="Name"
                  v-bind:type="{ 'is-danger': !!errors[0] }"
                >
                  <b-input
                    placeholder="Shelf, Box, ..."
                    name="name"
                    v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                    v-model="form.name"
                    required
                    type="text"
                    :disabled="!checkOwner()"
                    validation-message="Not a valid Name"
                    maxlength="40"
                  ></b-input>
                </b-field>
              </validation-provider>

              <validation-provider
                :rules="{
                  required: true,
                  regex: /^[a-zA-Z0-9_@./#&;:+-äÄöÖüÜ ]*$/
                }"
                v-slot="{ errors }"
              >
                <b-field
                  label="Description"
                  v-bind:type="{ 'is-danger': !!errors[0] }"
                >
                  <b-input
                    placeholder="Description"
                    name="description"
                    v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                    v-model="form.description"
                    required
                    type="text"
                    :disabled="!checkOwner()"
                    validation-message="Not a valid Name"
                    maxlength="40"
                  ></b-input>
                </b-field>
              </validation-provider>

              <validation-provider
                :rules="{
                  required: true,
                  regex: /^[a-zA-Z0-9_@./#&;:+-äÄöÖüÜ ]*$/
                }"
                v-slot="{ errors }"
              >
                <b-field
                  label="Location"
                  v-bind:type="{ 'is-danger': !!errors[0] }"
                >
                  <b-input
                    placeholder="Living Room, Kitchen, ..."
                    name="location"
                    v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                    v-model="form.location"
                    required
                    type="text"
                    :disabled="!checkOwner()"
                    validation-message="Not a valid Name"
                    maxlength="40"
                  ></b-input>
                </b-field>
              </validation-provider>

              <div class="columns">
                <div class="control column">
                  <button
                    @click.prevent="$parent.close()"
                    class="button is-dark is-fullwidth"
                  >
                    Close
                  </button>
                </div>
                <div class="control column" v-if="!getFocusedStoreId">
                  <button
                    type="submit"
                    class="button is-dark is-fullwidth"
                    :disabled="invalid"
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
                <div class="control column" v-else>
                  <button
                    type="submit"
                    class="button is-dark is-fullwidth"
                    :disabled="invalid"
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
          </ValidationObserver>
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
            v-for="(comment) in getStore.comments"
            v-bind:key="comment.id"
            @close="deleteComment(comment.id)"
            :title="comment.user + ' | ' + comment.created"
            aria-close-label="Close message"
          >
            {{ comment.comment }}
          </b-message>

          <ValidationObserver v-slot="{ invalid }">
          <form method="post" @submit.prevent="createComment">
              <validation-provider
                :rules="{
                  required: true,
                  regex: /^[a-zA-Z0-9_@./#&;:+-äÄöÖüÜ ]*$/
                }"
                v-slot="{ errors }"
              >
                <b-field
                  label="Comment"
                  v-bind:type="{ 'is-danger': !!errors[0] }"
                >
                  <b-input
                    name="comment"
                    v-bind:icon="!!errors[0] ? '' : 'check-circle'"
                    v-model="commentToSend"
                    required
                    type="text"
                    validation-message="Not a valid Comment"
                    maxlength="250"
                  ></b-input>
                </b-field>
              </validation-provider>


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
                  :disabled="invalid"
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
          </ValidationObserver>
        </b-tab-item>

        <b-tab-item label="Picture" v-if="this.getFocusedStoreId">
          <b-field class="file is-light" :class="{ 'has-name': !!file, 'is-primary': checkOwner() }">
            <b-upload
              @input="uploadFile('store')"
              v-model="file"
              :disabled="!checkOwner()"
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
            :src="
              'http://localhost:8080/api/image/download/' +
              getStore.imageId +
              '/' +
              this.$auth.getToken('local').slice(6)
            "
            :alt="getStore.imageId"
            responsive
            ratio="6by4"
          ></b-image>
        </b-tab-item>

        <b-tab-item label="QR Code" v-if="this.getFocusedStoreId">
          <div id="printableQRCode">
          <h2 class="subtitle">VindThing</h2>
          <p>Store Name: {{ form.name }}</p>
          <p>Store ID: {{ this.getFocusedStoreId }}</p>
          <br />
          <qrcode-vue
            id="qrcode"
            :value="'http://localhost:3000/stores?id=' + this.getFocusedStoreId"
            size="400"
            level="H"
            renderAs="svg"
          ></qrcode-vue>
          </div>
          <br />
          <button @click="printQRCode()" class="button is-dark is-half">
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

/////////////////////
// Form Validation
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import {
  required,
  email,
  alpha_dash,
  alpha_num,
  alpha_spaces,
  regex,
} from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This field is required - Bensch",
});
extend("email", email);
extend("alpha_dash", alpha_dash);
extend("alpha_spaces", alpha_spaces);
extend("alpha_num", alpha_num);
extend("regex", regex);
/////////////////////

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
      if (!this.getFocusedStoreId) return true;

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
      let commentPayload = [];
      commentPayload.commentId = commentId;
      commentPayload.storeId = this.getFocusedStoreId;
      this.$store.dispatch("stores/deleteComment", commentPayload);
    },
    async printQRCode() {
      var mywindow = window.open("", "", "height=400,width=600");
      mywindow.document.write("<html><head><title>QR Code</title>");
      // mywindow.document.write('<style> p { -webkit-font-smoothing: antialiased;text-rendering: optimizeLegibility;text-size-adjust: 100%;font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;color: #4a4a4a;font-size: 1em;font-weight: 400;line-height: 1.5;-webkit-box-direction: normal;box-sizing: inherit;margin: 0;padding: 0; } </style>');
      mywindow.document.write("</head><body >");
      mywindow.document.write(
        document.getElementById("printableQRCode").innerHTML
      );
      mywindow.document.write("</body></html>");
      mywindow.document.close();

      mywindow.focus();
      setTimeout(function () {
        mywindow.print();
      }, 500);
      mywindow.onfocus = function () {
        setTimeout(function () {
          mywindow.close();
        }, 500);
      };
    },
  },
  components: {
    QrcodeVue,
    ValidationProvider, // Form Validation
    ValidationObserver, // Form Validation
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