<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <div class="field has-addons">
          <p class="control">
            <button id="connect" class="button" onclick="connect()">
              Connect
            </button>
          </p>
          <p class="control">
            <button id="disconnect" class="button" onclick="disconnect()">
              Disconnect
            </button>
          </p>
        </div>
      </div>
      <div class="column">
        Second column
      </div>
      <div class="column">
        Third column
      </div>
      <div class="column">
        Fourth column
      </div>
    </div>

    <h1 class="text-center mb-4">Chat</h1>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3" id="users" style="display: none;">
          <span id="active-users-span"></span>
          <ul id="active-users" class="list-group list-group-horizontal-sm">
          </ul>
        </div>
        <div id="divSelectedUser" class="mb-3" style="display: none;">
          <span id="selectedUser" class="badge badge-secondary"></span> Selected
        </div>
        <div class="mb-3">
          <div class="input-group" id="sendmessage" style="display: none;">
            <input type="text" id="message" class="form-control" placeholder="Message"/>
            <div class="input-group-append">
              <button id="send" class="btn btn-primary" onclick="send()">Send</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div id="content"></div>
        <div>
          <span class="float-right">
            <button
              id="clear"
              class="btn btn-primary"
              onclick="clearMessages()"
              style="display: none;"
            >Clear</button>
          </span>
        </div>
        <div id="response"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Notification from "~/components/Notification";
import {mapGetters} from "vuex";

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
          src: "js/ws-client.js"
        }
      ],
      link: []
    };
  }
};
connect(loggedInUser.email);
</script>
