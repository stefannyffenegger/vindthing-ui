export const state = () => ({
    stores: []
})

export const mutations = {
    SET_STORE(state, stores) {
        state.stores = stores
    },
    ADD_STORE(state, store) {
        state.stores.push(store)
    },
    REMOVE_STORE(state, store_id) {
       /*  state.stores.forEach(function(store) {
            console.log(store.id);
            if (store.id == store_id) {state.stores.splice(state.stores.indexOf(store), 1);}
        }  ); */

        const index = state.stores.findIndex(store => store.id === store_id );
        if (index >= 0) {state.stores.splice(index, 1);}

    },
    UPDATE_STORE(state, { store }) {
        state.stores.push({
            text,
            done: false
        })
    }
}

export const actions = {
    async getStores({ commit }) {
        this.$axios.get("/api/store/get-all")
            .then(response => { commit('SET_STORE', response.data) } )
    },
    async createStore({ commit }, form) {
        let res = await this.$axios.post("/api/store/add", {
            name: form.name,
            description: form.description,
            location: form.location
        });
        console.log(res.data);

        commit('ADD_STORE', res.data)
    },
    async updateStore() {
        let res = await this.$axios.post("/store/add", {
            name: this.name,
            description: this.description,
            location: this.location
        });
        console.log(res);
        this.stores.push(res);
    },
    async deleteStore({ commit }, store_id) {

        let res = await this.$axios.post("/api/store/delete", {
            id: store_id
        });
        console.log(res);

        ///////////
        // Anschauen
        commit('REMOVE_STORE', store_id)

    }
}

export const getters = {
    getStores(state) {
        return state.stores
    }
}