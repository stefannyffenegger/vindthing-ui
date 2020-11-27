export const state = () => ({
    stores: [],
    focusedStoreId: null,
    focusedItemId: null
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
    UPDATE_STORE(state, store) {
        const storeIndex = state.stores.findIndex(storeObject => storeObject.id === store.id );
        if (storeIndex >= 0 ) {
            state.stores.splice(storeIndex, 1, store);
        }
    },
    ADD_ITEM(state, item) {
        const index = state.stores.findIndex(store => store.id === item.storeId );
        delete item.storeId;
        state.stores[index].items.push(item)
    },
    REMOVE_ITEM(state, item) {
        const storeIndex = state.stores.findIndex(store => store.id === item.storeId );
        const itemIndex = state.stores[storeIndex].items.findIndex(itemInStore => itemInStore.id === item.id );

        if (storeIndex >= 0 && itemIndex >= 0) {state.stores[storeIndex].items.splice(itemIndex, 1);}
    },
    UPDATE_ITEM(state, item) {
        const storeIndex = state.stores.findIndex(store => store.id === item.storeId );
        const itemIndex = state.stores[storeIndex].items.findIndex(itemInStore => itemInStore.id === item.itemId );
        delete item.storeId;
        delete item.itemId;
        if (storeIndex >= 0 && itemIndex >= 0) {
            state.stores[storeIndex].items.splice(itemIndex, 1, item);
        }

    },
    SET_FOCUSED_STORE_ID(state, store_id) {
        state.focusedStoreId = store_id
    },
    SET_FOCUSED_ITEM_ID(state, item_id) {
        state.focusedItemId = item_id
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

        commit('ADD_STORE', res.data)
    },
    async updateStore({ commit }, form) {
        let res = await this.$axios.post("/api/store/update", {
            id: form.storeId,
            name: form.name,
            description: form.description,
            location: form.location
        });

        commit('UPDATE_STORE', res.data)
    },
    async deleteStore({ commit }, store_id) {

        let res = await this.$axios.post("/api/store/delete", {
            id: store_id
        });

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

        ///////////
        // Anschauen
        commit('REMOVE_ITEM', item)
    },
    async updateItem({ commit }, form) {

        let res = await this.$axios.post("/api/item/update", {
            id: form.itemId,
            name: form.name,
            description: form.description,
            quantity: form.quantity
        });

        ////////////////
        /// Inefficent
        res.data.storeId = form.storeId
        res.data.itemId = form.itemId

        ///////////
        // Anschauen
        commit('UPDATE_ITEM', res.data)
    },

    async setFocusedStoreId({ commit }, store_id) {
        commit('SET_FOCUSED_STORE_ID', store_id)
    },
    async setFocusedItemId({ commit }, item_id) {
        commit('SET_FOCUSED_ITEM_ID', item_id)
    },
}

export const getters = {
    getStores(state) {
        return state.stores
    },
    getFocusedStoreId(state) {
        return state.focusedStoreId
    },
    getFocusedItemId(state) {
        return state.focusedItemId
    }
}