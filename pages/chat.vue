<template>
  <div class="section">
    <h2 class="title">Chat</h2>

    <div class="columns">
      <div class="column is-half">
        <div class="columns">
          <div class="column is-half">
            <input type="text" id="from" class="input" :value=loggedInUser.email />
          </div>
          <div class="buttons has-addons level-right">
            <b-button
              type="button"
              id="connect"
              class="button is-success"
              onclick="connect()"
            >Connect
            </b-button>
            <b-button
              type="button"
              id="disconnect"
              class="button is-danger"
              onclick="disconnect()"
              disabled
            >Disconnect</b-button>
          </div>
        </div>

        <div class="columns" id="users" style="display: none;">
          <span id="active-users-span"></span>
        </div>

        <div class="columns">
          <ul id="active-users" class=""></ul>
        </div>

        <div id="divSelectedUser" class="columns" style="display: none;">
          <span id="selectedUser" class="badge badge-secondary"></span> Selected
        </div>

        <div class="columns">
          <div class="field" id="sendmessage" style="display: none;">
            <input type="text" id="message" class="input" placeholder="Your message"/>
            <b-button id="send" class="button is-info" onclick="send()">Send</b-button>
          </div>
        </div>
      </div>

      <div class="column is-half">
        <div class="columns">
          <div>
            <b-button
              id="clear"
              class="button is-primary"
              onclick="clearMessages()"
              style="display: none;"
            >Clear</b-button>
          </div>
          <div id="response"></div>
        </div>

        <div class="columns">
          <div id="content"></div>
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
