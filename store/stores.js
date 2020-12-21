export const state = () => ({
    stores: [],
    focusedStoreId: null,
    focusedItemId: null
})

export const mutations = {
    /* Set all stores to local store */
    SET_STORE(state, stores) {
        state.stores = stores
    },

    /* Add single store to store array */
    ADD_STORE(state, store) {
        store.items = []
        state.stores.push(store)
    },

    /* Remove single store from store array */
    REMOVE_STORE(state, store_id) {
        const index = state.stores.findIndex(store => store.id === store_id);
        if (index >= 0) { state.stores.splice(index, 1); }
    },

    /* Update single store in store array */
    UPDATE_STORE(state, store) {
        const storeIndex = state.stores.findIndex(storeObject => storeObject.id === store.id);
        if (storeIndex >= 0) {
            state.stores.splice(storeIndex, 1, store);
        }
    },

    /* Update single store via WebSocket function */
    UPDATE_STORE_SOCKET(state, store) {
        const storeIndex = state.stores.findIndex(storeObject => storeObject.id === store.id);
        if (storeIndex >= 0) {
            state.stores.splice(storeIndex, 1, store);
        } else {
            state.stores.push(store)
        }
    },

    /* Add single item to specific store */
    ADD_ITEM(state, item) {
        const index = state.stores.findIndex(store => store.id === item.storeId);
        delete item.storeId;
        state.stores[index].items.push(item)
    },

    /* Removes single item from specific store */
    REMOVE_ITEM(state, item) {
        const storeIndex = state.stores.findIndex(store => store.id === item.storeId);
        const itemIndex = state.stores[storeIndex].items.findIndex(itemInStore => itemInStore.id === item.id);

        if (storeIndex >= 0 && itemIndex >= 0) { state.stores[storeIndex].items.splice(itemIndex, 1); }
    },

    /* Removes comment from specific store */
    REMOVE_COMMENT(state, commentPayload) {
        const storeIndex = state.stores.findIndex(store => store.id === commentPayload.storeId);
        const commentIndex = state.stores[storeIndex].comments.findIndex(commentsInStore => commentsInStore.id === commentPayload.commentId);

        if (storeIndex >= 0 && commentIndex >= 0) { state.stores[storeIndex].comments.splice(commentIndex, 1); }
    },

    /* Update single item in specific store */
    UPDATE_ITEM(state, item) {
        const storeIndex = state.stores.findIndex(store => store.id === item.storeId);
        const itemIndex = state.stores[storeIndex].items.findIndex(itemInStore => itemInStore.id === item.id);
        delete item.storeId;
        if (storeIndex >= 0 && itemIndex >= 0) {
            state.stores[storeIndex].items.splice(itemIndex, 1, item);
        }
    },

    /* Update image in specific store */
    UPDATE_IMAGE_STORE(state, object) {
        const storeIndex = state.stores.findIndex(store => store.id === object.storeId);
        state.stores[storeIndex].imageId = object.imageId;
    },

    /* Update image in specific store */
    UPDATE_PROFILE(state, userPayload) {
        this.$auth.user.name = userPayload.name
    },

    /* Move item in antoher store */
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

    /* Set focused store id */
    SET_FOCUSED_STORE_ID(state, store_id) {
        state.focusedStoreId = store_id
    },

    /* Set focused item id */
    SET_FOCUSED_ITEM_ID(state, item_id) {
        state.focusedItemId = item_id
    },
}

export const actions = {

    /* Get all stores from backend and commit to vuex store */
    async getStores({ commit }) {
        return this.$axios.get("/api/store/get-all")
            .then(response => { commit('SET_STORE', response.data) })
    },

    /* Create store in backend and commit to vuex store */
    async createStore({ commit }, form) {
        let res = await this.$axios.post("/api/store/add", {
            name: form.name,
            description: form.description,
            location: form.location
        });

        commit('ADD_STORE', res.data)
    },

    /* Create store in backend and commit to vuex store */
    async updateStore({ commit }, form) {
        let res = await this.$axios.post("/api/store/update", {
            id: form.storeId,
            name: form.name,
            description: form.description,
            location: form.location
        });

        commit('UPDATE_STORE', res.data)
    },

    /* Update store in local store only */
    async updateStoreSocket({ commit }, storeObject) {
        commit('UPDATE_STORE_SOCKET', storeObject)
    },

    /* Delete store in backend and local store */
    async deleteStore({ commit }, store_id) {
        let res = await this.$axios.post("/api/store/delete", {
            id: store_id
        });

        commit('REMOVE_STORE', store_id)
    },

    /* Delete store in local store only */
    async deleteStoreSocket({ commit }, store_id) {
        commit('REMOVE_STORE', store_id)
    },

    /* Upload file in backend and link to local store */
    async uploadFile({ commit }, formData) {
        let res = await this.$axios.post("/api/image/upload", formData, {
            "Content-Type": "multipart/form-data"
        });

        res.data.storeId = formData.get("objectId");

        commit('UPDATE_IMAGE_STORE', res.data)
    },

    /* Update shared users in backend and local store */
    async updateSharedUsers({ commit }, payloadSharedUsers) {
        let res = await this.$axios.post("/api/store/user/update", {
            sharedUsers: payloadSharedUsers.sharedUsers,
            storeId: payloadSharedUsers.storeId,
            owner: payloadSharedUsers.ownerEmail
        });

        commit('UPDATE_STORE', res.data)
    },

    /* Create Item in backend and local store */
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

    /* Update Profile in backend and local store */
    async updateProfile({ commit }, userPayload) {
        let res = await this.$axios.put("/api/auth/profile/update", {
            name: userPayload.name,
            password: userPayload.password,
        });
        commit('UPDATE_PROFILE', userPayload)
    },

    /* Delete Item in backend and local store */
    async deleteItem({ commit }, item) {

        let res = await this.$axios.post("/api/item/delete", {
            id: item.id
        });

        commit('REMOVE_ITEM', item)
    },

    /* Delete Item in local store only */
    async deleteItemSocket({ commit }, item) {
        commit('REMOVE_ITEM', item)
    },

    /* Update Item in backend and local store */
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

    /* Increment Item counter in backend and local store */
    async incrementCounter({ commit }, form) {

        let res = await this.$axios.post("/api/item/update", {
            id: form.itemId,
            inStore: form.inStore
        });

        res.data.storeId = form.storeId

        commit('UPDATE_ITEM', res.data)
    },

    /* Move item to a specific store in backend and local store */
    async moveItem({ commit }, form) {

        let res = await this.$axios.post("/api/item/move", {
            id: form.itemId,
            storeId: form.newStoreId,
        });

        res.data.oldStoreId = form.oldStoreId
        res.data.newStoreId = form.newStoreId

        commit('MOVE_ITEM', res.data)
    },

    /* Set focused store id */
    async setFocusedStoreId({ commit }, store_id) {
        commit('SET_FOCUSED_STORE_ID', store_id)
    },

    /* Set focused item id */
    async setFocusedItemId({ commit }, item_id) {
        commit('SET_FOCUSED_ITEM_ID', item_id)
    },

    ///////////////////////////
    // Comment Section
    ///////////////////////////

    /* Create comment in backend and local store */
    async createComment({ commit }, commentPayload) {
        let res = await this.$axios.post("/api/store/comment/add", {
            message: commentPayload.comment,
            storeId: commentPayload.storeId,
        });

        commit('UPDATE_STORE', res.data)
    },

    /* Delete comment in backend and local store */
    async deleteComment({ commit }, commentPayload) {
        let res = await this.$axios.post("/api/store/comment/remove", {
            id: commentPayload.commentId
        });

        commit('REMOVE_COMMENT', commentPayload)
    },

    /* Delete comment in local store only */
    async deleteCommentSocket({ commit }, commentPayload) {
        commentPayload.commentId = commentPayload.id
        commit('REMOVE_COMMENT', commentPayload)
    },

}

export const getters = {
    /* Getter for all stores */
    getStores(state) {
        return state.stores
    },

    /* Getter for focused store id */
    getFocusedStoreId(state) {
        return state.focusedStoreId
    },

    /* Getter for focused item id */
    getFocusedItemId(state) {
        return state.focusedItemId
    }
}