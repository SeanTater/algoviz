function Stat(name, benchmark) {
   this.name = name;
   this.benchmark = benchmark;
   this.count = 800;
   this.cap = 150000;
   this.runtimes = [];
   this.costs = [];
   
   // This is called before the DOM is finished. So call this later.
   $(function(){
        $("#benchmark_settings").append('<input type="checkbox" name="sb on hm" value="sb on hm" checked="true" />'
            + '<label for="sb on hm">' + benchmark.name + ' on ' + HashtableMap.name + '</label><br />');
   });
}

Stat.prototype.chart_enabled = function() {
    // Fill in code here
}