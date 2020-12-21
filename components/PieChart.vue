/* Component used in Chat Page */

<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: ['data', 'options'],
  mounted () {
    // Triggers Chart rendering, sadly not Reactive
    this.renderChart(this.data, this.options);
  }
}
</script>
