<template>
  <section class="section">
    <div class="container">
      <h2 class="title">Spaces</h2>
      <div class="content">
        <form method="post" @submit.prevent="createSpace">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input type="text" class="input" name="name" v-model="name" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <input type="text" class="input" name="description" v-model="description" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Location</label>
            <div class="control">
              <input type="text" class="input" name="location" v-model="location" required />
            </div>
          </div>
          <div class="control">
            <button type="submit" class="button is-dark is-fullwidth">Create Space</button>
          </div>
        </form>

        <ul>
          <li :key="id" v-for="{ id, name, description } in generateSpaces">
            <nuxt-link
              v-if="name !== 'foo'"
              :to="`/${id}`"
            >Name: {{ name }} Beschreibung: {{ description }}</nuxt-link>
            <p v-else>{{ name }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  middleware: "auth",
  data() {
    return {
      name: "",
      description: "",
      location: ""
    };
  },
  async asyncData({ $axios }) {
    return { spaces: await $axios.$get("/store/get-all") };
  },
  computed: {
    generateSpaces() {
      return this.spaces;
    }
  },
  methods: {
    async createSpace() {
      const result = await this.$axios.post("/store/add", {
        name: this.name,
        description: this.description,
        location: this.location
      });
      console.log(result);

      this.spaces.push(result);
    },
    async deleteSpace() {
      const result = await this.$axios.post("/store/delete", {
        id: this.id
      });
      console.log(result);

      if (this.spaces.indexOf(value) > -1) {
        this.spaces.splice(this.spaces.indexOf(value), 1);
      }
    }
  }
};
</script>
