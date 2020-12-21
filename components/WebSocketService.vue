<template></template>

<script>
/* Import WebSocket components */
import SockJS from "sockjs-client";
import { Client, Message, Stomp } from "@stomp/stompjs";

export default {
  data() {
    return {
      /* Store properties for WebSocket connections */
      connected: false,
      email: this.$auth.$state.user.email
    };
  },
  /* Force User Authentication by Import auth Module */
  middleware: "auth",


  methods: {
    /* Connect to Websocket and subscribe to various channels */
    connect() {
      let formData = new FormData();
      formData.append("username", this.$auth.$state.user.email);
      try {
        this.$axios.post("/api/chat/user-connect", formData, {});
      } catch (e) {
        console.log(e);
      }

      this.socket = new SockJS("http://localhost:8080/chat");
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        { username: this.$auth.$state.user.email },
        (frame) => {
          this.connected = true;

          // For development purpose, compiler removes log function for production builds
          console.log(frame);

          this.stompClient.subscribe("/client/store/update", (tick) => {
            let store = JSON.parse(tick.body);
            this.$store.dispatch("stores/updateStoreSocket", store);
          });

          this.stompClient.subscribe("/client/store/delete", (tick) => {
            let store = JSON.parse(tick.body);
            this.$store.dispatch("stores/deleteStoreSocket", store.message);
          });

          this.stompClient.subscribe("/client/comment/delete", (tick) => {
            let store = JSON.parse(tick.body);
            this.$store.dispatch("stores/deleteCommentSocket", store);
          });

          this.stompClient.subscribe("/client/item/delete", (tick) => {
            let store = JSON.parse(tick.body);
            this.$store.dispatch("stores/deleteItemSocket", store);
          });

          //////////////////
          //////////////////
          this.stompClient.subscribe("/topic/active", (tick) => {
            let users = JSON.parse(tick.body);
            this.$store.dispatch("chat/setUsers", users);
          });

          this.stompClient.subscribe("/client/queue/messages", (tick) => {
            let message = JSON.parse(tick.body);
            this.$store.dispatch("chat/addMessage", message);
            if (message.from !== this.$auth.$state.user.email) {
              this.messageNotification(
                "<b>" + message.from + ":</b> <br>" + message.text
              );
            }
          });
          //////////////////
          //////////////////

          this.stompClient.send(
            "/app/broadcast",
            {},
            JSON.stringify({ from: "server", text: "Connected" })
          );
        },
        (error) => {
          console.log(error);
          this.connected = false;
        }
      );
    },

    /* Disconnects and unsubcribes all channels  */
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
    },

    /* Toggle connection state */
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect();
    },
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
  },

  /* Connects on creation of this component */
  mounted() {
    this.connect();
  },

  /* Sets a subscribe mechanism to store mutations of type SEND_MESSAGE */
  /* And reacts when message has to be sent */
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "chat/SEND_MESSAGE") {
        let message = mutation.payload;

        this.stompClient.send(
          "/ws/chat",{},JSON.stringify(
            {
              from: message.from,
              text: message.text,
              recipient: message.recipient,
            },
            { sender: message.from }
          )

        );
      }
    });
  },
  /* Unsubscribe everything and disconnects from WebSocket connection */
  beforeDestroy() {
    this.unsubscribe();
    this.disconnect();

    /* Send message that user isn't available anymore */
    let formData = new FormData();
    formData.append("username", this.email);
    try {
      this.$axios.post("/api/chat/user-disconnect", formData, {} );
    } catch (e) {
      console.log(e);
    }
  },
};
</script>