Wiki = {
  /** Parse and setup wiki runner */
  init: function(text) {
    $("#logwindow").append("<br/>Collecting documents from wikipedia..<br/>");
    Wiki.crawl_wikipedia(["Goose"], 5, function() {
      // When finished crawling wikipedia
      $("#logwindow").append("Finished collecting " + Articles.all.length + " documents.<br/>");
      setTimeout(function(){
        Wiki.get_histograms([
          new Stat("Builtin Object", Wiki.hist_builtin, 800, 51200),
          new Stat("Unbalanced Binary Search Tree", Wiki.hist_bst, 800, 51200),
          new Stat("Hashtable", Wiki.hist_hash, 800, 51200),
          new Stat("Sorted Array", Wiki.hist_sorted_array, 800, 51200),
        ]); // get_histograms()
      }, 0); // setTimeout()
    }); // crawl_wikipedia()
  }, // init()

  /** Crawl up to `limit` pages of Wikipedia articles, starting at `names`.
    * Names is an array of article names, and the crawl is a BFS.
    */
  crawl_wikipedia: function(names, limit, done) {
    var next_names = [];
    Articles.fetch(names, function(article){ // for each article
      if (next_names.indexOf(article.title) < 0) {
        next_names = next_names.concat(article.links);
      }
      limit--;
    }, function() { // at the end of the fetch
      if (limit > 0) { // Trigger the next level of the BFS
        setTimeout(function(){
          Wiki.crawl_wikipedia(next_names.slice(0, limit), limit, done);
        }, 0); 
      } else {
        done();
      }
    }); // Articles.fetch
  }, // crawl_wikipedia


  /** Rerun a performance test against a queue of datasets
   * Each dataset is run 10 times and averaged
   * If it has not met the size cap, it is doubled
   * If it has met the cap, it moves to the next entry or schedules for charts
   *   to be drawn.
   */
  get_histograms: function(q) {
    // Setup this entry in the queue
    e = q[0]
    // You can't index more tokens than you have
    e.count = Math.min(e.count, Articles.all_tokens.length);
    
    // Run the performance tests 10 times
    var run_time = new Date();
    for(var i=0; i<3; i++) {
      e.benchmark( Articles.all_tokens.slice(0, e.count) );
    }
    run_time = (new Date() - run_time)/3;
    
    // Log the results
    $("#logwindow").append("["+e.name+":"+e.count+"]:"+ run_time + "ms<br />");
    e.runtimes.push(run_time);
    e.costs.push(run_time/e.count);
    
    // What to do after this function?
    if (e.count < Math.min(e.cap, Articles.all_tokens.length)) {
      // Spawn another test
      e.count *= 2;
      setTimeout(function(){ Wiki.get_histograms(q) }, 0);
    } else if (q.length > 1) {
      // Finish this group and test a new benchmark
      q.shift();
      setTimeout(function(){ Wiki.get_histograms(q) }, 0);
    } else {
      // Display the results
      setTimeout(Stats.display, 0);
    }
  },
  
  /** Display a chart at the end */
  finish: function() {
    Stats.init(Wiki._stats);
  },
  
  hist_builtin: function(tokens) {
    // Use a builtin object
    var hist = {};
    tokens.forEach(function(token){
      hist[token] = (hist[token] | 0) + 1;
    })
  },
  
  hist_bst: function(tokens) {
    // Create a _unbalanced_ BST that takes 2-entry objects
    var tree = new buckets.BSTree(function(t1, t2){
      if (t1.token < t2.token) { return -1; }
      else if (t1.token > t2.token) { return 1; }
      else { return 0; }
    });
    
    tokens.forEach(function(token){
      var node = tree.searchNode(tree.root, token);
      if (node == null) {
        tree.add({token: token, count: 1});
      } else {
        node.count += 1;
      }
    })
  },
  
  hist_hash: function(tokens) {
    // Use a specialized hashtable
    var ht = new Hashtable();
    tokens.forEach(ht.count, ht);
  },
  
  hist_sorted_array: function(tokens) {
    // Use two parallel sorted arrays
    var arr = new SortedArray();
    tokens.forEach(arr.count, arr);
  }
};

$(Wiki.init);
