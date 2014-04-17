/**
 * SearchBenchmark searches for tokens in a prepopulated structure
 * 
 * interface Benchmark {
 *     Structure subject
 *     string subject_name
 * 
 *     float function(int count)
 * }
 */
function SearchBenchmark(subject) {
    this.subject = subject;
    this.subject_name = subject.name;
}

SearchBenchmark.prototype.run = function(count) {
    var tokens = Articles.all_tokens.slice(0, count);
    var subject = new this.subject()
    subject.populate(tokens);
    var start = new Date();
    for (var i=0; i<3; i++) {
        subject.searchAll(tokens);
    }
    return new Date() - start;
}