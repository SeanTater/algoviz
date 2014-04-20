/**
 * Maintains a Chart and its dataset
 * 
 * interface Chart {
 *     string title
 * 
 *     undefined function add(Stat stat)
 *     undefined function display()
 * }
 */
function Chart(title) {
    this.title = title;
    this._all_costs = [];
    this._all_runtimes = [];
}

Chart.prototype.add = function(stat) {
    this._all_costs.push({name: stat.name, data: stat.costs});
    this._all_runtimes.push({name: stat.name, data: stat.runtimes});
}

Chart.prototype.display = function() {
    var id_part = this.title.toLowerCase();
    new Highcharts.Chart({
      chart: {renderTo: id_part + "_time_chart", zoomType: "xy"},
      title: {text: this.title + ": Runtime by Set Size"},
      xAxis: {
        title: {text: "words"},
        labels: {
          formatter: function(){return "" + (10000 * (this.value + 1));},
          step: 1
        }
      },
      yAxis: {title: {text: "milliseconds"}},
      series: this._all_runtimes
    });
    new Highcharts.Chart({
      chart: {renderTo: id_part + "_cost_chart", zoomType: "xy"},
      title: {text: this.title + ": Cost per Lookup by Set Size"},
      xAxis: {
        title: {text: "words"},
        labels: {
          formatter: function(){return "" + (10000 * (this.value + 1));},
          step: 1
        }
      },
      yAxis: {title: {text: "milliseconds per lookup"}},
      series: this._all_costs
    });
  }