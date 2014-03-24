function BuiltinMap() {
  // Use a builtin object
  this.hist = {}
}

BuiltinMap.prototype.populate = function(tokens) {
  tokens.forEach(function(token){
    this.hist[token] = (this.hist[token] | 0) + 1;
  }, this)

  // TODO: This unfairly skews the results for builtin
  var entries = [];
  for (var word in this.hist) {
    entries.push({word: word, count: this.hist[word]});
  }
  entries.sort(function(a, b){ return b.count - a.count });
  entries = entries.slice(0, 25);
  $("#histogram").empty();
  entries.forEach(function(entry) {
    $("#histogram").append("<tr><td>"+entry.word+"</td><td>"+entry.count+"</td></tr>");
  });
};