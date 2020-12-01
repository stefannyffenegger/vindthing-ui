<template>
  <section class="section">
    <h2 class="title">Insights</h2>
    <hr/>
    <b-tabs>
      <b-tab-item label="Item Usage">
        <pie-chart :data="pieChartData" :options="barChartOptions" :height="200"/>
      </b-tab-item>
      <b-tab-item label="Something else">
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
      labelsPieChart: [],
      dataPieChart: [],
      isCardLayout: false,
      test: ["test1", "test2", "test3"],
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
            data: [10, 15, 20, 30, 40, 50, 60, 70, 34, 45, 11, 78, 45],
            backgroundColor: '#ff9305'
          }
        ]
      }
    }
  },
  mounted() {
    this.$store.dispatch("stores/getStores");
    this.$store.dispatch("stores/setFocusedStoreId", "5fc28cfac354b846a87963d8");
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
    async getItems() {
      
      const index = this.$store.state.stores.stores.findIndex(
        (store) => store.id === this.getFocusedStoreId
      );
      console.log(this.$store.state.stores.stores)
      return this.$store.state.stores.stores[index].items;
    },
    async getUseCount() {
      
      let manipulate = this.getItems()
      
      let useCounts = manipulate.map(item => ({name: item.name, useCount: item.useCount})
        )
        .flat();
        console.log(useCounts)

    }
  },

}
</script>
