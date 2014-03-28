/** Creates benchmarks using wall-clock time
 * This is the best we can do in the circumstances because JS doesn't support
 * anything else. No cpu times. */
function WallClockBenchmark(structure) {
    this.structure = structure;
}

WallClockBenchmark.prototype.run = function(count) {
    // Run the performance tests 3 times
    var run_time = new Date();
    for(var i=0; i<3; i++) {
      new this.structure().populate( Articles.all_tokens.slice(0, count) );
    }
    return (new Date() - run_time)/3;
}