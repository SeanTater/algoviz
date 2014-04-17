function Stat(name, benchmark) {
   this.name = name;
   this.benchmark = benchmark;
   this.count = 800;
   this.cap = 150000;
   this.runtimes = [];
   this.costs = [];
   
   // This is called before the DOM is finished. So call this later.
   $(function(){
       var benchmark_name = benchmark.constructor.name.replace("Benchmark", "");
       var map_name = benchmark.subject_name.replace("Map", "");
       $("#benchmark_settings").append('<input type="checkbox" name="sb on hm" value="sb on hm" checked="true" />'
           + '<label for="sb on hm">' + benchmark_name + ' ' + map_name + '</label><br />');
   });
}

Stat.prototype.chart_enabled = function() {
    // Fill in code here
}