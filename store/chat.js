export const state = () => ({
    messages: [],
    users: []
})

export const mutations = {
    SET_USERS(state, users) {
        const userIndex = users.findIndex(user => user === this.$auth.$state.user.email);
        if (userIndex >= 0) { users.splice(userIndex, 1); }
        state.users = users;
    },
    ADD_MESSAGE(state, message) {
        state.messages.push(message)
    },
    SEND_MESSAGE(state, message) {
        return;
    },
    CLEAR_MESSAGE(state) {
        state.messages = [];
    },
}

export const actions = {
    async setUsers({ commit }, users) {
        commit('SET_USERS', users)
    },
    async addMessage({ commit }, message) {
        commit('ADD_MESSAGE', message)
    },
    async sendMessage({ commit }, message) {
        commit('SEND_MESSAGE', message)
    },
    async clearMessage({ commit }) {
        commit('CLEAR_MESSAGE')
    },
}

export const getters = {
    getUsers(state) {
        return state.users
    },
    getMessages(state) {
        return state.messages
    },
}