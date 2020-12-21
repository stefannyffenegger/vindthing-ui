export const state = () => ({
    messages: [],
    users: []
})

export const mutations = {
    /* Set user to local data */
    SET_USERS(state, users) {
        const userIndex = users.findIndex(user => user === this.$auth.$state.user.email);
        if (userIndex >= 0) { users.splice(userIndex, 1); }
        state.users = users;
    },

    /* Add a message to local messages array */
    ADD_MESSAGE(state, message) {
        state.messages.push(message)
    },

    /* Do nothing with message, but needed to trigger WebSocket Service to send it via Watcher! */
    SEND_MESSAGE(state, message) {
        return;
    },

    /* Clear all messages in local state */
    CLEAR_MESSAGE(state) {
        state.messages = [];
    },
}

export const actions = {
    /* Set users in local state*/
    async setUsers({ commit }, users) {
        commit('SET_USERS', users)
    },

    /* Add message to local state*/
    async addMessage({ commit }, message) {
        commit('ADD_MESSAGE', message)
    },

    /* Send message only, dont save it to local state. Reason is described above */
    async sendMessage({ commit }, message) {
        commit('SEND_MESSAGE', message)
    },

    /* Clear all messages in local state */
    async clearMessage({ commit }) {
        commit('CLEAR_MESSAGE')
    },
}

export const getters = {
    /* Get all users */
    getUsers(state) {
        return state.users
    },

    /* Get all messages */
    getMessages(state) {
        return state.messages
    },
}