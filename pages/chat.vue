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
            <p v-if="$store.state.chat.users === null">No active Users found.</p>
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
            <p v-show="$store.state.chat.users !== null" class="badge badge-secondary">
              Selected User: {{ selectedUser }}
            </p>
          </div>
        </div>

        <div class="columns">
          <div class="field column" id="sendmessage" style="">
            <input
              type="text"
              :disabled="!selectedUser"
              id="message"
              class="input"
              placeholder="Your message"
            />
          </div>
          <div class="column">
            <b-button id="send" :disabled="!selectedUser" class="button is-info" @click="send(userName)"
              >Send</b-button
            >
          </div>
        </div>
      </div>

        <!-- ZZZZZZZZZZZZZZ -->
        <div class="columns">
          <div id="messages-content">
            <ul id="messages-content-items" class="">
              <li
                v-for="(message, index) in $store.state.chat.messages"
                :key="index"
                class="list-group-item"
              >
                <a
                  class="message-item"
                >
                  {{ message }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- ZZZZZZZZZZZZZZ -->

      <div class="column is-half">
        <div class="columns">
          <div id="content"></div>
        </div>

        <div class="columns">
          <div class="column">
            <b-button
              id="clear"
              class="button is-primary"
              @click="clearMessages()"
              style="display: none"
              >Clear</b-button
            >
          </div>
          <div id="response"></div>
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
  mounted() {
    /* Connect / Subscribe Chat to Websocket Endpoints */
    // this.connect(this.$auth.$state.user.email);
  },
  data() {
    return {
      selectedUser: null,
      stompClient: null,
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
     * Connect to server and subscribe
     * @param userName Username of logged in User
     */
    async connect(userName) {
      // Check if Username is set
      if (userName == null || userName === "") { return; }

      if(this.connected) {return;}

      // Define form data to send as an Axios Post Request
      let formData = new FormData();
      formData.append("username", this.$auth.$state.user.email);

      // Post via Axios, if request fails, notify User
      try {
        this.$axios
          .post("/api/chat/user-connect", formData, {})
          .then((response) => {
            this.connectionSuccessSnackbar();
          });
      } catch (e) {
        console.log("Connection failed, " + e);
        this.connectionWarningSnackbar();
      }

      // Connect via SockJS & Stomp
      var socket = new SockJS(this.chatServer + "/chat");
      this.stompClient = Stomp.over(socket);

      this.stompClient.connect(
        { username: this.$auth.$state.user.email },
        (frame) => {
          console.log(frame);

          this.stompClient.subscribe("/topic/active", (tick) => {
            this.updateUsers(userName);
          });

          this.stompClient.subscribe("/client/queue/messages", (tick) => {
            console.log("MESSAGES SUBSCRIBE");
            this.showMessage(this.createTextNode(JSON.parse(tick.body)));
          });

          this.sendConnection(" connected to server");

          //this.setConnected(true);
        },
        (error) => {
          // If connecting fails, notify User and give him the possibility to retry (via Action Handler in method connectionWarningSnackbar )
          console.log(error);
          this.connectionWarningSnackbar();
          this.setConnected(false);
        }
      );
    },

    /**
     * Disconnect Websocket connection
     */
    disconnect() {
      if (this.stompClient != null) {
        try {
          this.$axios
            .post(
              "/api/chat/user-disconnect",
              { username: parent.userName },
              {}
            )
            .then((response) => {
              this.sendConnection(" disconnected from server");

              this.stompClient.disconnect((response) => {
                console.log("disconnected...");
                this.setConnected(false);
                this.connectionWarningSnackbar();
              });
            });
        } catch (e) {
          console.log("Connection failed, " + e);
          this.$buefy.toast.open("Couldn't disconnect. Have a nice day");
          this.connectionWarningSnackbar();
        }
      }
    },

    async sendConnection(message) {
      var text = this.userName + message;
      this.stompClient.send("/app/broadcast", JSON.stringify({ from: "server", text: text }), {});

      // for first time or last time, list active users:
      let res = await this.updateUsers(this.userName);
    },

    /**
     * Send a message
     */
    send(userName) {
      var text = $("#message").val();
      if (typeof this.selectedUser !== "string") {
        console.log(this.selectedUser);
        this.userSelectWarningSnackbar("Please select a user first");
        return;
      }

      let message = { from: userName, text: text, recipient: this.selectedUser }

/*       /////////////////
      this.stompClient.send(
        "/ws/chat",

        JSON.stringify(
          { from: userName, text: text, recipient: this.selectedUser },
          { sender: userName }
        )
      );
      ///////////////// */

      this.$store.dispatch("chat/sendMessage", message);


      $("#message").val("");
    },

    createTextNode(messageObj) {
      var classAlert = "alert-info";
      var fromTo = messageObj.from;
      var addTo = fromTo;
      let self = false;

      if (this.userName == messageObj.from) {
        fromTo = messageObj.recipient;
        addTo = "to: " + fromTo;
        self = true;
      }

      if (this.userName != messageObj.from && messageObj.from != "server") {
        classAlert = "alert-warning";
      }

      if (messageObj.from != "server") {
        addTo =
          '<a href="javascript:void(0)" onclick="this.setSelectedUser(\'' + //////////////
          fromTo +
          "')\">" +
          addTo +
          "</a>";
      }

      var htmlMessage =
        '<div class="row alert ' +
        classAlert +
        '"><div class="">' +
        messageObj.text +
        '</div><div class=""><small>[<b>' +
        addTo +
        "</b> " +
        messageObj.time +
        "]</small>" +
        "</div></div>";

      // show notification if not sent to self
      if (!self) {
        this.messageNotification(htmlMessage);
      }

      return htmlMessage;
    },

    showMessage(message) {
      $("#content").html($("#content").html() + message); // show message in div
      $("#clear").show(); // show clear button
    },

    clearMessages() {
      $("#content").html("");
      $("#clear").hide();
    },

    setSelectedUser(username) {
      this.selectedUser = username;
      $("#selectedUser").html(this.selectedUser);
      if ($("#selectedUser").html() == "") {
        $("#divSelectedUser").hide();
      } else {
        $("#divSelectedUser").show();
      }
    },

    /**
     * COMMENT ME
     * @param storeObject
     */
    async updateUsers(userName) {
      try {
        this.$axios
          .get("/api/chat/active-users-except/" + userName, {})
          .then((response) => {
            let userList = response.data;
            
            console.log(userList)

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
  created() {
      this.updateUsers(this.userName)
    }
};
</script>
