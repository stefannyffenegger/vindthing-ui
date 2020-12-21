
/* Component used in Chat Page */

<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['data', 'options'],
  mounted () {
    // Triggers Chart rendering, sadly not Reactive
    this.renderChart(this.data, this.options);
  }
}
</script>
