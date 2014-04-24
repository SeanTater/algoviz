/**
 * MixedBenchmark searches, inserts, and removes tokens
 * 
 * interface Benchmark {
 *     Structure subject
 *     string subject_name
 * 
 *     float function(int count)
 * }
 */
function MixedBenchmark(subject) {
    this.subject = subject;
    this.subject_name = subject.name;
}

MixedBenchmark.prototype.run = function(count) {
    var tokens = Articles.all_tokens.slice(0, count);
    // NOTE: Should we fill this first or not?
    var target = new this.subject();
    target.populate(tokens);
    var search_insert = $("#mixed_search_percent").val() | 0;
    var insert_delete = search_insert + ($("#mixed_insert_percent").val() | 0);
    var delete_end = insert_delete + ($("#mixed_delete_percent").val() | 0);
    
    var start = new Date();
    for (var i=0; i<3; i++) {
        tokens.forEach(function(token) {
            var r = Math.random() * delete_end;
            if (r < search_insert) {
                target.get(token);
            } else if (r < insert_delete) {
                target.put(token, 87);
            } else {
                target.delete(token);
            }
        }, this);
    }
    return new Date() - start;
}