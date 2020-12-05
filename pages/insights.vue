<template>
  <section class="section">
    <h2 class="title">Insights</h2>
    <hr/>
    <b-tabs>
      <b-tab-item label="Item Usage">
        <pie-chart v-if="loaded" :data="pieChartData" :options="pieChartOptions" :height="200"/>
        <!-- <LazyPieChart></LazyPieChart> -->
      </b-tab-item>
      <b-tab-item label="Item creation">
        <bar-chart :data="barChartData" :options="barChartOptions" :height="200"/>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import {mapMutations, mapGetters} from "vuex";

export default {
  data() {
    return {
      loaded: false,

      labelsPieChart: [],
      dataPieChart: [],
      isCardLayout: false,
      slider: [],
      barChartData: {
        labels: [
          '2019-06',
          '2019-07',
          '2019-08',
          '2019-09',
          '2019-10',
          '2019-11',
          '2019-12',
          '2020-01',
          '2020-02',
          '2020-03',
          '2020-04',
          '2020-05'
        ],
        datasets: [
          {
            label: 'Visits',
            data: [10, 15, 20, 30, 40, 50, 60, 70, 34, 45, 11, 78, 45],
            backgroundColor: '#003f5c'
          },
          {
            label: 'Pages Views',
            data: [30, 24, 57, 23, 68, 72, 25, 64, 133, 143, 165, 33, 56],
            backgroundColor: '#2f4b7c'
          },
          {
            label: 'Users',
            data: [45, 65, 30, 53, 34, 35, 26, 37, 34, 45, 67, 87, 98],
            backgroundColor: '#665191'
          }
        ]
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Usage',
          fontSize: 24,
          fontColor: '#6b7280'
        },
        tooltips: {
          backgroundColor: '#17BF62'
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      },
      pieChartData: {
        labels: [],
        datasets: [
          {
            label: 'Uses',
            data: [],
            backgroundColor: ["#2274a5","#f75c03","#f1c40f","#d90368","#00cc66", "#ebdccb","#00c49a","#ef233c","#35a7ff","#2e294e","#00171f","#00cc99","#5e7ce2","#e6e6ea","#341c1c"], 
          }
        ]
      },
      pieChartOptions: {
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Usage',
          fontSize: 24,
          fontColor: '#6b7280'
        },
        tooltips: {
          backgroundColor: '#17BF62'
        },

      },
    }
  },
  async mounted() {
    await this.$store.dispatch("stores/getStores");
    await this.$store.dispatch("stores/setFocusedStoreId", "5fca67712384ca064ba6e210");
    await this.getUseCount();
  },
  middleware: "auth",
  computed: {
    ...mapGetters({
      getAllStores: "stores/getStores",
      getFocusedStoreId: "stores/getFocusedStoreId",
    }),
    getStore() {
      let index = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );
      return this.$store.state.stores.stores[index];
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
    getItems() {
      const index = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );
      console.log(this.$store.state.stores.stores)
      // 0 als Quick Fix
      return this.$store.state.stores.stores[index].items;
    },
    async getUseCount() {
      
      let manipulate = this.getItems()
      
      /* this.useCountsNames = manipulate.map(item => ({name: item.name, useCount: item.useCount})).flat(); */
      this.pieChartData.datasets[0].data = manipulate.map(item => (item.useCount)).flat();
      this.pieChartData.labels = manipulate.map(item => (item.name)).flat();

      this.loaded = true

    }
  },

}
</script>
