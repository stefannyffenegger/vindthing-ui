<template></template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  //name: "websocketdemo",
  data() {
    return {
      received_messages: [],
      connected: false,
    };
  },
  methods: {
    async send(send_message) {
      console.log("Send message:" + send_message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = { name: this.send_message };
        console.log(JSON.stringify(msg));
        this.stompClient.send("/app/hello", JSON.stringify(msg), {});
      }
    },
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


          this.stompClient.subscribe("/client/sync/store", (tick) => {
            let store = JSON.parse(tick.body);
            this.$store.dispatch("stores/updateStoreSocket", store);
          });


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
  },
    mounted() {
      this.connect();
    },
};
</script>