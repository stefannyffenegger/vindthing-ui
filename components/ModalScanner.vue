<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Scan QR Code</p>
    </header>
    <div class="modal-card-body">

        <div class="columns">
          <div class="column">
            <video id="scanSource"></video>
            FUCK
          </div>
        </div>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

/* Import QR Code Scan Library */
import QrScanner from 'qr-scanner';

export default {
  components: {
    QrScanner
  },
  data() {
    return {
      form: {
        itemId: "",
        oldStoreId: "",
        newStoreId: "",
      },
      searchSpecificStore: "",
      selected: null,
    };
  },
  computed: {
    ...mapGetters({
      getFocusedStoreId: "stores/getFocusedStoreId",
      getFocusedItemId: "stores/getFocusedItemId",
    }),
  },

  mounted() {
    let videoElem = document.querySelector("#scanSource");
    console.log(videoElem)
    
    let qrScanner = new QrScanner(videoElem, result => console.log('decoded qr code:', result));
    qrScanner.WORKER_PATH = '../../node_modules/qr-scanner/qr-scanner-worker.min.js';
    qrScanner.start();

  },
  destroyed() {
    this.$store.dispatch("stores/setFocusedItemId", null);
  },

  methods: {
    async moveItem() {
      if (this.getFocusedStoreId != this.form.newStoreId) {
        this.form.oldStoreId = this.getFocusedStoreId;
        this.form.newStoreId = this.selected.id;
        this.form.itemId = this.getFocusedItemId;
        this.$store.dispatch("stores/moveItem", this.form);
        // Jump into the new Store
        // this.$store.dispatch("stores/setFocusedStoreId", this.form.newStoreId);
        this.form = [];
      }
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