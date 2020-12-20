<template></template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  data() {
    return {
      received_messages: [],
      connected: false,
    };
  },
  middleware: "auth",
  methods: {
    connect() {
      let formData = new FormData();
      formData.append("username", this.$auth.$state.user.email);
      console.log(this.$auth.$state.user.email)
      try {
        this.$axios.post("/api/chat/user-connect", formData, {
        });
      } catch (e) {
        console.log(e);
      }

      this.socket = new SockJS("http://localhost:8080/chat");
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect( {username: this.$auth.$state.user.email},
        (frame) => {
          this.connected = true;
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
            if (message.from !== this.$auth.$state.user.email) { this.messageNotification("<b>" + message.from + ":</b> <br>" + message.text); } 
          });
          //////////////////
          //////////////////

          this.stompClient.send("/app/broadcast", JSON.stringify({ from: "server", text: "Connected" }), {})


        }, (error) => {
          console.log(error);
          this.connected = false;
        }
      );
      
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
    },
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
  mounted() {
      this.connect();
    },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      console.log(mutation.payload);
      if (mutation.type === 'chat/SEND_MESSAGE') {
        console.log(`Updating to ${mutation}`);

        let message = mutation.payload;

        // Do whatever makes sense now
        this.stompClient.send("/ws/chat", JSON.stringify(
          { from: message.from, text: message.text, recipient: message.recipient },
          { sender: message.from }
        )
      );

      }
    });
    
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
</script>