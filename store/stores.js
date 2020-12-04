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
        const index = state.stores.findIndex(store => store.id === store_id);
        if (index >= 0) { state.stores.splice(index, 1); }
    },
    UPDATE_STORE(state, store) {
        const storeIndex = state.stores.findIndex(storeObject => storeObject.id === store.id);
        if (storeIndex >= 0) {
            state.stores.splice(storeIndex, 1, store);
        }
    },
    UPDATE_STORE_SOCKET(state, store) {
        const storeIndex = state.stores.findIndex(storeObject => storeObject.id === store.id);
        if (storeIndex >= 0) {
            state.stores.splice(storeIndex, 1, store);
        } else {
            state.stores.push(store)
        }
    },
    ADD_ITEM(state, item) {
        const index = state.stores.findIndex(store => store.id === item.storeId);
        delete item.storeId;
        state.stores[index].items.push(item)
    },
    REMOVE_ITEM(state, item) {
        const storeIndex = state.stores.findIndex(store => store.id === item.storeId);
        const itemIndex = state.stores[storeIndex].items.findIndex(itemInStore => itemInStore.id === item.id);

        if (storeIndex >= 0 && itemIndex >= 0) { state.stores[storeIndex].items.splice(itemIndex, 1); }
    },
    REMOVE_COMMENT(state, commentPayload) {
        const storeIndex = state.stores.findIndex(store => store.id === commentPayload.storeId);
        const commentIndex = state.stores[storeIndex].comments.findIndex(commentsInStore => commentsInStore.id === commentPayload.commentId);

        if (storeIndex >= 0 && commentIndex >= 0) { state.stores[storeIndex].comments.splice(commentIndex, 1); }
    },
    UPDATE_ITEM(state, item) {
        const storeIndex = state.stores.findIndex(store => store.id === item.storeId);
        const itemIndex = state.stores[storeIndex].items.findIndex(itemInStore => itemInStore.id === item.id);
        delete item.storeId;
        if (storeIndex >= 0 && itemIndex >= 0) {
            state.stores[storeIndex].items.splice(itemIndex, 1, item);
        }
    },
    UPDATE_IMAGE_STORE(state, object) {
        const storeIndex = state.stores.findIndex(store => store.id === object.storeId);
        state.stores[storeIndex].imageId = object.imageId;
    },
    UPDATE_PROFILE(state, userPayload) {
        this.$auth.user.name = userPayload.name
    },
    MOVE_ITEM(state, item) {
        var storeIndex = state.stores.findIndex(store => store.id === item.newStoreId);
        var tempOldStoreId = item.oldStoreId
        delete item.newStoreId;
        delete item.oldStoreId;
        state.stores[storeIndex].items.push(item)

        storeIndex = state.stores.findIndex(store => store.id === tempOldStoreId);
        var itemIndex = state.stores[storeIndex].items.findIndex(itemInStore => itemInStore.id === item.id);

        if (storeIndex >= 0 && itemIndex >= 0) { state.stores[storeIndex].items.splice(itemIndex, 1); }
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
            .then(response => { commit('SET_STORE', response.data) })
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
    async updateStoreSocket({ commit }, storeObject) {
        commit('UPDATE_STORE_SOCKET', storeObject)
    },
    async deleteStore({ commit }, store_id) {

        let res = await this.$axios.post("/api/store/delete", {
            id: store_id
        });

        commit('REMOVE_STORE', store_id)
    },
    async deleteStoreSocket({ commit }, store_id) {
        commit('REMOVE_STORE', store_id)
    },
    async uploadFile({ commit }, formData) {
        let res = await this.$axios.post("/api/image/upload", formData, {
            "Content-Type": "multipart/form-data"
        });

        console.log(formData.get("objectId"))
        res.data.storeId = formData.get("objectId");

        commit('UPDATE_IMAGE_STORE', res.data)
    },
    async updateSharedUsers({ commit }, payloadSharedUsers) {
        let res = await this.$axios.post("/api/store/user/update", {
            sharedUsers: payloadSharedUsers.sharedUsers,
            storeId: payloadSharedUsers.storeId,
            owner: payloadSharedUsers.ownerEmail
        });

        commit('UPDATE_STORE', res.data)
    },
    async createItem({ commit }, form) {
        let res = await this.$axios.post("/api/item/add", {
            name: form.name,
            description: form.description,
            quantity: form.quantity,
            storeId: form.storeId
        });

        res.data.storeId = form.storeId

        commit('ADD_ITEM', res.data)
    },

    async updateProfile({ commit }, userPayload) {
        let res = await this.$axios.put("/api/auth/profile/update", {
            name: userPayload.name,
            password: userPayload.password,
        });
        commit('UPDATE_PROFILE', userPayload)
    },
    async deleteItem({ commit }, item) {

        let res = await this.$axios.post("/api/item/delete", {
            id: item.id
        });

        commit('REMOVE_ITEM', item)
    },
    async deleteItemSocket({ commit }, item) {
        commit('REMOVE_ITEM', item)
    },
    async updateItem({ commit }, form) {

        let res = await this.$axios.post("/api/item/update", {
            id: form.itemId,
            name: form.name,
            description: form.description,
            quantity: form.quantity,
            inStore: form.inStore
        });

        res.data.storeId = form.storeId

        commit('UPDATE_ITEM', res.data)
    },
    async incrementCounter({ commit }, form) {

        let res = await this.$axios.post("/api/item/update", {
            id: form.itemId,
            inStore: form.inStore
        });

        res.data.storeId = form.storeId

        commit('UPDATE_ITEM', res.data)
    },
    async moveItem({ commit }, form) {

        let res = await this.$axios.post("/api/item/move", {
            id: form.itemId,
            storeId: form.newStoreId,
        });

        res.data.oldStoreId = form.oldStoreId
        res.data.newStoreId = form.newStoreId

        commit('MOVE_ITEM', res.data)
    },

    async setFocusedStoreId({ commit }, store_id) {
        commit('SET_FOCUSED_STORE_ID', store_id)
    },
    async setFocusedItemId({ commit }, item_id) {
        commit('SET_FOCUSED_ITEM_ID', item_id)
    },

    ///////////////////////////
    // Comment Section
    ///////////////////////////
    async createComment({ commit }, commentPayload) {
        let res = await this.$axios.post("/api/store/comment/add", {
            message: commentPayload.comment,
            storeId: commentPayload.storeId,
        });

        commit('UPDATE_STORE', res.data)
    },
    async deleteComment({ commit }, commentPayload) {
        let res = await this.$axios.post("/api/store/comment/remove", {
            id: commentPayload.commentId
        });

        commit('REMOVE_COMMENT', commentPayload)
    },
    async deleteCommentSocket({ commit }, commentPayload) {
        commentPayload.commentId = commentPayload.id
        commit('REMOVE_COMMENT', commentPayload)
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