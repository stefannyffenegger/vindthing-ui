<template>
  <section class="section">
    <h2 class="title">Insights</h2>
    <hr />
    <b-tabs>
      <b-tab-item label="Item Usage">

          <div class="columns">
            <div class="column">
              <b-field label="Find a Store">
                <b-autocomplete
                  v-model="searchSpecificStore"
                  placeholder="e.g. Basement"
                  open-on-focus
                  :data="filteredDataObj"
                  field="name"
                  @select="(option) => (selected = option, getUseCount() )"
                  clearable
                  max-width="300px"
                  append-to-body
                  clear-on-select
                >
                </b-autocomplete>
              </b-field>
            </div>
          </div>

        <br />

        <pie-chart
          :data="pieChartData"
          :key="componentKey"
          :options="pieChartOptions"
          :height="200"
        />
        <!-- <LazyPieChart></LazyPieChart> -->
      </b-tab-item>
      <b-tab-item label="Item creation">

          <div class="columns">
            <div class="column">
              <b-field label="Find a Store">
                <b-autocomplete
                  v-model="searchSpecificStore"
                  placeholder="e.g. Basement"
                  open-on-focus
                  :data="filteredDataObj"
                  field="name"
                  @select="(option) => (selected = option, getCreationDates() )"
                  clearable
                  max-width="300px"
                  append-to-body
                  clear-on-select
                >
                </b-autocomplete>
              </b-field>
            </div>
          </div>

        <br />

        <bar-chart
          :data="barChartData"
          :key="componentKey"
          :options="barChartOptions"
          :height="200"
        />
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      // Data for Store Picker
      searchSpecificStore: "",
      selected: null,

      // Loaded State for PieChart
      componentKey: 0,

      labelsPieChart: [],
      dataPieChart: [],
      isCardLayout: false,
      slider: [],
      barChartData: {
        labels: [
          "2019-06",
          "2019-07",
          "2019-08",
          "2019-09",
          "2019-10",
          "2019-11",
          "2019-12",
          "2020-01",
          "2020-02",
          "2020-03",
          "2020-04",
          "2020-05",
        ],
        datasets: [
          {
            label: "Created Items",
            data: [],
            backgroundColor: "#003f5c",
          },
          {
            label: "Updated Items",
            data: [],
            backgroundColor: "#2f4b7c",
          }
        ],
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: "Usage",
          fontSize: 24,
          fontColor: "#6b7280",
        },
        tooltips: {
          backgroundColor: "#17BF62",
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
      pieChartData: {
        labels: [],
        datasets: [
          {
            label: "Uses",
            data: [],
            backgroundColor: [
              "#2274a5",
              "#f75c03",
              "#f1c40f",
              "#d90368",
              "#00cc66",
              "#ebdccb",
              "#00c49a",
              "#ef233c",
              "#35a7ff",
              "#2e294e",
              "#00171f",
              "#00cc99",
              "#5e7ce2",
              "#e6e6ea",
              "#341c1c",
            ],
          },
        ],
      },
      pieChartOptions: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Usage",
          fontSize: 24,
          fontColor: "#6b7280",
        },
        tooltips: {
          backgroundColor: "#17BF62",
        },
      },
    };
  },
  async mounted() {
    this.$store.dispatch("stores/getStores").then((res) => {
                this.getUseCount();
                this.getCreationDates();
            });
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
    },
    filteredDataObj() {
      return this.$store.state.stores.stores.filter((option) => {
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(this.searchSpecificStore.toLowerCase()) >= 0
        );
      });
    },
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    async getUseCount() {
      if (this.selected === null) {
        if (Array.isArray(this.$store.state.stores.stores) && this.$store.state.stores.stores.length) {
            this.selected = this.$store.state.stores.stores[0]
          } else { return }
      }
      
      let manipulate = this.selected.items;

      this.pieChartData.datasets[0].data = manipulate
        .map((item) => item.useCount)
        .flat();
      this.pieChartData.labels = manipulate.map((item) => item.name).flat();

      this.pieChartOptions.title.text = "Usage of " + this.selected.name

      this.forceRerender();
    },
    async getCreationDates() {
      if (this.selected === null) {
        if (Array.isArray(this.$store.state.stores.stores) && this.$store.state.stores.stores.length) {
            this.selected = this.$store.state.stores.stores[0]
          } else { return }
      }
      
      let manipulate = this.selected.items;


      // Grouping Objects with ES6 entries function
      // Created Items
      let slicedDatesCreated = manipulate.map((item) => item.created.slice(0, 7)).flat();
      let slicedDatesEdited = manipulate.map((item) => item.lastedit.slice(0, 7)).flat();

      // Merging Dates for BarChart Labels
      let mergedDates = [];
      slicedDatesCreated.forEach( function(value) { if (!mergedDates.includes(value) ) {mergedDates.push(value)} } )
      slicedDatesEdited.forEach( function(value) { if (!mergedDates.includes(value) ) {mergedDates.push(value)} } )

      // Grouping Objects with ES6 entries function
      // Updated Items
      let groupedObjectsCreated = slicedDatesCreated.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
      let groupedObjectsEdited = slicedDatesEdited.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));

      this.barChartData.labels = mergedDates.sort();
      this.barChartData.datasets[0].data = [];
      this.barChartData.datasets[1].data = [];

/*       for (const [key, value] of Object.entries(groupedObjectsCreated)) {
        console.log(key +  " " + value)
        for (let index = 0; index < this.barChartData.labels.length; ++index) { if ( this.barChartData.labels[index] === key ) { this.barChartData.datasets[0].data[index] = value }
        }
      } */

      for (let index = 0; index < this.barChartData.labels.length; ++index) { if ( groupedObjectsCreated[this.barChartData.labels[index]] ) { this.barChartData.datasets[0].data[index] = groupedObjectsCreated[this.barChartData.labels[index]] }
      else {this.barChartData.datasets[0].data[index] = 0 } }

      for (let index = 0; index < this.barChartData.labels.length; ++index) { if ( groupedObjectsEdited[this.barChartData.labels[index]] ) { this.barChartData.datasets[1].data[index] = groupedObjectsEdited[this.barChartData.labels[index]] } 
      else {this.barChartData.datasets[1].data[index] = 0 } }

/*       for (const [key, value] of Object.entries(groupedObjectsEdited)) {
        console.log(key +  " " + value)
        for (let index = 0; index < this.barChartData.labels.length; ++index) { if ( this.barChartData.labels[index] === key ) { this.barChartData.datasets[1].data[index] = value }
        }
      } */

      // Set Title of Chart
      this.barChartOptions.title.text = "Created of " + this.selected.name;

      console.log(this.barChartData.datasets[0].data)
      console.log(this.barChartData.datasets[1].data)

      // Set Max Y-Axis
      const maxCreated = Math.max(...this.barChartData.datasets[0].data)
      const maxEdited = Math.max(...this.barChartData.datasets[1].data)
      console.log(maxCreated + " " + maxEdited)
      if (maxCreated < maxEdited) {this.barChartOptions.scales.yAxes[0].ticks.max = maxEdited} else {this.barChartOptions.scales.yAxes[0].ticks.max = maxCreated}

      this.forceRerender();
    },
  },
};
</script>
