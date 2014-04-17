/**
 * DeletionBenchmark removes tokens from a populated structure
 * 
 * 
 * interface Benchmark {
 *     Structure subject
 *     string subject_name
 * 
 *     float function(int count)
 * }
 */
function DeletionBenchmark(subject) {
    this.subject = subject;
    this.subject_name = subject.name;
}

DeletionBenchmark.prototype.run = function(count) {
    // TODO: Maybe we should not triple the memory requirements?
    var tokens = Articles.all_tokens.slice(0, count);
    var subjects = [];
    for (var i=0; i<3; i++) {
        subjects[i] = new this.subject();
        subjects[i].populate(tokens);
    }
    
    var start = new Date();
    for (var i=0; i<3; i++) {
        subjects[i].deleteBulk(tokens);
    }
    return new Date() - start;
}