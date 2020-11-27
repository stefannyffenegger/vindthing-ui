<template>
  <div class="section">
    <h2 class="title">Chat</h2>

    <div class="columns">
      <div class="column is-half">
        <div class="columns">
          <div class="column is-half">
            <input type="text" id="from" class="input" :value=loggedInUser.email />
          </div>
          <div class="buttons has-addons column">
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
          <div class="column">
            <span id="active-users-span"></span>
          </div>
        </div>

        <div class="columns">
          <div class="column">
          <ul id="active-users" class=""></ul>
          </div>
        </div>

        <div id="divSelectedUser" class="columns" style="display: none;">
          <div class="column">
            <span id="selectedUser" class="badge badge-secondary"></span> Selected
          </div>
        </div>

        <div class="columns">
          <div class="column">
          <div class="field" id="sendmessage" style="display: none;">
            <input type="text" id="message" class="input" placeholder="Your message"/>
            <b-button id="send" class="button is-info" onclick="send()">Send</b-button>
          </div>
          </div>
        </div>
      </div>

      <div class="column is-half">
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

        <div class="columns">
          <div id="content"></div>
        </div>
        <section>
          <div class="buttons">
            <button class="button is-medium" @click="simple">
              Launch notification (default)
            </button>

            <button class="button is-medium is-success" @click="success">
              Launch notification (custom)
            </button>

            <button class="button is-medium is-danger" @click="danger">
              Launch notification (custom)
            </button>
          </div>
        </section>
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
  methods: {
    simple() {
      this.$buefy.notification.open('Something happened')
    },
    success() {
      this.$buefy.notification.open({
        message: 'Something happened correctly!',
        type: 'is-success'
      })
    },
    danger() {
      const notif = this.$buefy.notification.open({
        duration: 5000,
        message: `Something's not good, also I'm on <b>bottom</b>`,
        position: 'is-bottom-right',
        type: 'is-danger',
        hasIcon: true
      })
      notif.$on('close', () => {
        this.$buefy.notification.open('Custom notification closed!')
      })
    }
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
