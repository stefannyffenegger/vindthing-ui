<template>
  <div class="section">
    <h2 class="title">Chat</h2>

    <div class="columns">
      <div id="available-users"></div>
    </div>

    <div class="columns">

      <div class="column is-half">

        <div class="columns">
          <div class="column is-half">
            <input type="text" id="from" class="input" style="display: none;" :value=loggedInUser.email />
          </div>
        </div>


        <div class="columns" id="users" style="">
          <div class="column">
            <span id="active-users-span"></span>
          </div>
        </div>

        <div class="columns">
          <div class="column">
          <ul id="active-users" class=""></ul>
          </div>
        </div>


        <div id="divSelectedUser" class="columns" style="">
          <div class="column">
            <span id="selectedUser" class="badge badge-secondary"></span> Selected
          </div>
        </div>

        <div class="columns">
          <div class="field column" id="sendmessage" style="">
            <input type="text" id="message" class="input" placeholder="Your message"/>
          </div>
          <div class="column">
            <b-button id="send" class="button is-info" onclick="send()">Send</b-button>
          </div>
        </div>
      </div>

      <div class="column is-half">
        <div class="columns">
          <div id="content"></div>
        </div>

        <div class="columns">
          <div class="column">
            <b-button
              id="clear"
              class="button is-primary"
              onclick="clearMessages()"
              style="display: none;"
            >Clear</b-button>
          </div>
          <div id="response"></div>
        </div>


      </div>

    </div>
  </div>
</template>

<script>
import Notification from "~/components/Notification";
import { mapGetters } from "vuex";

export default {
  middleware: "auth",
  components: {
    Notification
  },
  computed: {
    ...mapGetters(["loggedInUser"])
  },
  mounted() {
    // this.connect(this.loggedInUser.email);
  },
  head() {
    return {
      script: [
        {
          src:
            "https://cdn.jsdelivr.net/npm/sockjs-client@1.5.0/dist/sockjs.min.js"
        },
        {
          src: "https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js"
        },
        {
          src: "js/chat.js"
        }
      ],
      link: []
    };
  }
};
</script>
