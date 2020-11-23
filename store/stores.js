export const state = () => ({
    stores: [],
    focusedStoreId: null
})

export const mutations = {
    SET_STORE(state, stores) {
        state.stores = stores
    },
    ADD_STORE(state, store) {
        store.items = []
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
    },
    ADD_ITEM(state, item) {
        const index = state.stores.findIndex(store => store.id === item.storeId );
        delete item.storeId;
        state.stores[index].items.push(item)
    },
    REMOVE_ITEM(state, item) {
        const index = state.stores.findIndex(store => store.id === item.storeId );
        console.log("index:" + index)
        state.stores[index].items.pull(item)
    },
    SET_FOCUSED_STORE_ID(state, store_id) {
        state.focusedStoreId = store_id
    },
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
    },
    async createItem({ commit }, form) {
        let res = await this.$axios.post("/api/item/add", {
            name: form.name,
            description: form.description,
            quantity: form.quantity,
            storeId: form.storeId
        });
        ////////////////
        /// Inefficent
        res.data.storeId = form.storeId

        commit('ADD_ITEM', res.data)
    },
    async deleteItem({ commit }, item) {

        let res = await this.$axios.post("/api/item/delete", {
            id: item.id
        });
        console.log(res);

        ///////////
        // Anschauen
        commit('REMOVE_ITEM', item)
    },

    async setFocusedStoreId({ commit }, store_id) {
        commit('SET_FOCUSED_STORE_ID', store_id)
    },
}

export const getters = {
    getStores(state) {
        return state.stores
    },
    getFocusedStoreId(state) {
        return state.focusedStoreId
    }
}