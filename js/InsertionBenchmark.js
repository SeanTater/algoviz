/**
 * InsertionBenchmark gives calculated benchmark results for reference
 * The point is to give a line on the chart for comparison
 * 
 * interface Benchmark {
 *     Structure subject
 *     string subject_name
 * 
 *     float function(int count)
 * }
 */
function InsertionBenchmark(subject) {
    this.subject = subject;
    this.subject_name = subject.name;
    this._equation = equation;
}

InsertionBenchmark.prototype.run = function(count) {
    var tokens = Article.all_tokens.slice(0, count);
    var start = new Date();
    for (var i=0; i<3; i++) {
        new this.subject().populate(tokens);
    }
    return (start - new Date();
}