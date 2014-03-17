function Stat(name, benchmark, count, cap) {
   this.name = name;
   this.benchmark = benchmark;
   this.count = count;
   this.cap = cap;
   this.runtimes = [];
   this.costs = [];
   Stats.structures.push(this);
}

Stats = {
  structures: [],
  display: function(info) {
    var all_runtimes = Stats.structures.map(function(stat) {
      return {name: stat.name, data: stat.runtimes};
    });
    var all_costs = Stats.structures.map(function(stat) {
      return {name: stat.name, data: stat.costs};
    });
    
    new Highcharts.Chart({
      chart: {renderTo: "time_chart"},
      title: {text: "Runtime by Set Size"},
      xAxis: {
        title: {text: "words"},
        labels: {
          formatter: function(){return "" + (800 << this.value);},
          step: 1
        }
      },
      yAxis: {title: {text: "milliseconds"}},
      series: all_runtimes
    });
    new Highcharts.Chart({
      chart: {renderTo: "cost_chart"},
      title: {text: "Cost per Lookup by Set Size"},
      xAxis: {
        title: {text: "words"},
        labels: {
          formatter: function(){return "" + (800 << this.value);},
          step: 1
        }
      },
      yAxis: {title: {text: "milliseconds per lookup"}},
      series: all_costs
    });
  }
}