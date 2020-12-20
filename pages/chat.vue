<template>
  <div class="section">
    <h2 class="title">Chat</h2>
    <hr />

    <div class="columns">
      <div class="column is-half">
        <div class="columns">
          <div class="column is-half">
            <input
              type="text"
              id="from"
              class="input"
              style="display: none"
              :value="loggedInUser.email"
            />
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <p v-if="$store.state.chat.users === null">
              No active Users found.
            </p>
            <p v-else>Click on a User to begin chat</p>
            <br />
            <ul id="active-users-new" class="">
              <li
                v-for="(username, index) in $store.state.chat.users"
                :key="index"
                class="list-group-item"
              >
                <a
                  class="active-user"
                  href="javascript:void(0)"
                  @click="setSelectedUser(username)"
                >
                  {{ username }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div id="divSelectedUser" class="columns" style="">
          <div class="column">
            <p
              v-show="$store.state.chat.users !== null"
              class="badge badge-secondary"
            >
              Selected User: {{ selectedUser }}
            </p>
          </div>
        </div>

        <div class="columns">
          <div class="field column is-8" id="sendmessage" style="">
            <input
              type="text"
              :disabled="!selectedUser"
              id="message"
              v-model="inputField"
              class="input"
              placeholder="Your message"
            />
          </div>
          <div class="column">
            <b-button
              id="send"
              :disabled="!selectedUser || !inputField"
              class="button is-info"
              @click="
                send(userName, inputField);
                inputField = '';
              "
              >Send</b-button
            >
            <b-button
              id="clear"
              class="button is-primary"
              @click="clearMessages()"
              >Clear</b-button
            >
          </div>
        </div>
      </div>

      <div class="column is-half">
        <div
          v-for="(message, index) in $store.state.chat.messages"
          :key="index"
          v-bind:class="
            message.from === userName ? 'column is-offset-4' : 'column is-8'
          "
        >
          <b-message
            :closable="false"
            v-bind:type="message.from === userName ? 'is-info' : 'is-primary'"
            :title="message.from + ' | ' + message.time"
            aria-close-label="Close message"
          >
            {{ message.text }}
          </b-message>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* Import all Getters for Vuex Store */
import { mapMutations, mapGetters } from "vuex";

import Notification from "~/components/Notification";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  /* Force User Authentication by Import auth Module */
  middleware: "auth",
  components: {
    Notification,
  },
  data() {
    return {
      selectedUser: null,
      stompClient: null,
      inputField: null,
      userName: this.$auth.$state.user.email,
      chatServer: "http://localhost:8080",
    };
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
  },
  methods: {
    /* Set connected state */
    setConnected(connected) {
      this.connected = connected;
    },

    /* Snackbar Notification when Chat gots connected */
    connectionSuccessSnackbar() {
      this.$nuxt.$buefy.snackbar.open("Chat connected!");
    },

    /* Snackbar Warning Notification when Chat got disconnected */
    connectionWarningSnackbar() {
      this.$nuxt.$buefy.snackbar.open({
        message: "Connection lost!",
        type: "is-warning",
        position: "is-top",
        actionText: "Retry",
        indefinite: true,
        queue: false,
        onAction: () => {
          location.reload();
        },
      });
    },

    /* Snackbar Warning Notification when no user is selected */
    userSelectWarningSnackbar(msg) {
      this.$nuxt.$buefy.snackbar.open({
        message: msg,
        type: "is-warning",
        position: "is-top",
        queue: false,
      });
    },

    /* Snackbar Notification when incoming message arrives */
    messageNotification(msg) {
      this.$nuxt.$buefy.notification.open({
        duration: 5000,
        message: msg,
        type: "is-info is-light",
        iconPack: "mdi",
        hasIcon: true,
        icon: "account",
        queue: false,
        position: "is-bottom-right",
      });
    },

    /**
     * Send a message and dispatch to Vuex Chat Store
     */
    send(userName, inputMessage) {
      if (typeof this.selectedUser !== "string") {
        console.log(this.selectedUser);
        this.userSelectWarningSnackbar("Please select a user first");
        return;
      }

      let message = {
        from: userName,
        text: inputMessage,
        recipient: this.selectedUser,
      };

      this.$store.dispatch("chat/sendMessage", message);
    },

    /**
     * Clears all Vuex Store Messages
     */
    clearMessages() {
      this.$store.dispatch("chat/clearMessage");
    },

    /**
     * Set selected User
     */
    setSelectedUser(username) {
      this.selectedUser = username;
    },

    /**
     * Update Users via push to Vuex Store
     */
    updateUsers(userName) {
      try {
        this.$axios
          .get("/api/chat/active-users-except/" + userName, {})
          .then((response) => {
            let userList = response.data;

            console.log(userList);

            if (userList.length == 0) {
              return;
            }

            // Set User List to local data - Reactive with Page
            this.$store.dispatch("chat/setUsers", userList);
          });
      } catch (e) {
        console.log(e);
        this.connectionWarningSnackbar();
      }

      return "done";
    },
  },
  /**
   * Execute Update User function when page got created
   */
  created() {
    this.updateUsers(this.userName);
  },
};
</script>
