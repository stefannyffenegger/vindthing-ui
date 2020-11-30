<template>
  <section class="section">
    <h2 class="title">Insights</h2>
    <hr/>
    <b-tabs>
      <b-tab-item label="Item Usage">
        <pie-chart :data="$store.state.stores.stores[0].items.useCount" :options="barChartOptions" :height="200"/>
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
          display: true
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
      }
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
  mounted() {
  }
}
</script>
