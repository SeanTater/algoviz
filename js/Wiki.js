Wiki = {
    /** Parse and setup wiki runner */
    init: function(text) {
        $("#logwindow").append("<br />Collecting documents from wikipedia..<br />");
        Wiki.crawl_wikipedia([$("#center_article").val()], 25);
    },

    /** Crawl up to `limit` pages of Wikipedia articles, starting at `names`.
        * Names is an array of article names, and the crawl is a BFS.
        */
    crawl_wikipedia: function(names, limit, done) {
        var next_names = [];
        Articles.fetch(names, function(article){ // for each article
            if (next_names.indexOf(article.title) < 0) {
                // If that article isn't already scheduled for downloading
                next_names = next_names.concat(article.links);
            }
            limit--;
        }, function() { // at the end of the fetch
            if (limit > 0) { // Trigger the next level of the BFS
                setTimeout(function(){
                    Wiki.crawl_wikipedia(next_names.slice(0, limit), limit, done);
                }, 0); 
            } else {
                $("#logwindow").append("Finished collecting " + Articles.all.length + " documents.<br/>");
                setTimeout(Wiki.init_histograms, 0);
            }
        }); // Articles.fetch
    }, // crawl_wikipedia

    init_histograms: function(){
        Wiki.current_chart = new Chart("Search");
        Wiki.get_histograms(available_histograms);
    },


    /** Rerun a performance test against a queue of datasets
    * Each dataset is run 3 times and averaged
    * If it has not met the size cap, it is doubled
    * If it has met the cap, it moves to the next entry or schedules for charts
    *   to be drawn.
    * 
    * charts should look like: [
    *   {
    *       name: "Insertion",
    *       runs: [
    *           new Stat(...),
    *           new Stat(...),
    *       ],
    *   }, {
    *       name: "Search",
    *       runs: [
    *           new Stat(...),
    *           new Stat(...)
    *       ],
    *   }
    * ]
    */
    get_histograms: function(charts) {
        // Setup this entry in the queue
        runs = charts[0].runs;
        e = runs[0];
        // You can't index more tokens than you have
        e.count = Math.min(e.count, Articles.all_tokens.length);
        
        // Run the (possibly synthetic) benchmark
        var run_time = e.benchmark.run(e.count);
        
        // Log the results
        $("#logwindow").append("["+e.name+":"+e.count+"]: "+ run_time + "ms<br />");
        e.runtimes.push(run_time);
        e.costs.push(run_time/e.count);
        
        // What to do after this function?
        if (e.count < Math.min(e.cap, Articles.all_tokens.length)) {
            // Spawn another test
            e.count *= 2;
            setTimeout(function(){ Wiki.get_histograms(charts) }, 0);
        } else if (runs.length > 1) {
            // Finish this group and test a new benchmark
            Wiki.current_chart.add(runs[0]);
            runs.shift();
            setTimeout(function(){ Wiki.get_histograms(charts) }, 0);
            //setTimeout(Wiki.current_chart.display.bind(Wiki.current_chart), 0);
        } else if (charts.length > 1) {
            // Display the results
            setTimeout(Wiki.current_chart.display.bind(Wiki.current_chart), 0);
            Wiki.current_chart.add(runs[0]);
            
            charts.shift();
            Wiki.current_chart = new Chart(charts[0].name);
            
            setTimeout(function(){ Wiki.get_histograms(charts) }, 0);
        } else {
            // Display the results
            setTimeout(Wiki.current_chart.display.bind(Wiki.current_chart), 0);
        }
    },
    
    
    available_histograms: [
            {
                name: "Search",
                runs: [
                    new Stat("Builtin Object", new SearchBenchmark(BuiltinMap)),
                    new Stat("Unbalanced Binary Search Tree", new SearchBenchmark(UnbalancedBSTMap)),
                    new Stat("Hashtable", new SearchBenchmark(HashtableMap)),
                    new Stat("Sorted Array", new SearchBenchmark(SortedArrayMap)),
                    //new Stat("n^2", new SyntheticBenchmark(function(n) {return 0.0005 * n * n;})),
                    new Stat("n log2 n", new SyntheticBenchmark(function(n) {return 0.0005 * n * Math.log(n) / Math.log(2);})),
                    new Stat("n", new SyntheticBenchmark(function(n) {return 0.0005 * n;})),
                ]
            }, {
                name: "Insertion",
                runs: [
                    new Stat("Builtin Object", new InsertionBenchmark(BuiltinMap)),
                    new Stat("Unbalanced Binary Search Tree", new InsertionBenchmark(UnbalancedBSTMap)),
                    new Stat("Hashtable", new InsertionBenchmark(HashtableMap)),
                    new Stat("Sorted Array", new InsertionBenchmark(SortedArrayMap)),
                    //new Stat("n^2", new SyntheticBenchmark(function(n) {return 0.0005 * n * n;}), 800, 51200),
                    new Stat("n log2 n", new SyntheticBenchmark(function(n) {return 0.0005 * n * Math.log(n) / Math.log(2);})),
                    new Stat("n", new SyntheticBenchmark(function(n) {return 0.0005 * n;})),
                ]
            }
        ]
};

$(function(){
    $("#get_histograms").click(Wiki.init);
});
