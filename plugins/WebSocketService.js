import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

import { mapGetters } from "vuex";

export default {
  //name: "websocketdemo",
  data() {
    return {
      received_messages: [],
      connected: false
    };
  },
  computed: {
    ...mapGetters(["loggedInUser"]),
    },
  async send(send_message) {
    console.log("Send message:" + send_message);
    if (this.stompClient && this.stompClient.connected) {
      const msg = { name: this.send_message };
      console.log(JSON.stringify(msg));
      this.stompClient.send("/app/hello", JSON.stringify(msg), {});
    }
  },
  async connect() {

    try {
      await this.$axios.post('/api/chat/user-connect', {
        username: this.loggedInUser.email
      })
    } catch (e) {
      console.log(e.response.data.message)
    }

    this.socket = new SockJS("http://localhost:8080/");
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect(
      {},
      frame => {
        this.connected = true;
        console.log(frame);
        this.stompClient.subscribe("/client/greetings", tick => {
          console.log(tick);
          this.received_messages.push(JSON.parse(tick.body).content);
        });
      },
      error => {
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
  }
};