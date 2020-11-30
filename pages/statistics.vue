<template>
  <section class="section">
    <h2 class="title">Statistics</h2>
    <hr/>

      <div>
        <!--bar-chart :data="barChartData" :options="barChartOptions" :height="200" /-->
      </div>


  </section>
</template>

<script>
import {mapMutations, mapGetters} from "vuex";

export default {
  data() {
    return {
      isCardLayout: false,
      test: ["test1", "test2", "test3"],
      slider: [],
    }
  },

  middleware: "auth",
  computed: {
    ...mapGetters({
      getAllStores: "stores/getStores",
      getFocusedStoreId: "stores/getFocusedStoreId",
    }),
    getItems() {
      const index = this.$store.state.stores.stores.findIndex(store => store.id === this.getFocusedStoreId);
      return this.$store.state.stores.stores[index].items
    }
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    fillData() {
      this.datacollection = {
        labels: [this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [this.getRandomInt(), this.getRandomInt()]
          }, {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [this.getRandomInt(), this.getRandomInt()]
          }
        ]
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  },
  //extends: Bar,
  //props: ['data', 'options'],
  mounted () {
    //this.renderChart(this.data, this.options)
  }
}
</script>
