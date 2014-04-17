function BuiltinMap() {
    // Use a builtin object
    this._store = {}
}

BuiltinMap.prototype.searchAll = function(tokens) {
    tokens.forEach(function(token){
        this._store[token];
    }, this);
};

BuiltinMap.prototype.populate = function(tokens) {
  tokens.forEach(function(token){
    this._store[token] = (this._store[token] | 0) + 1;
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

BuiltinMap.prototype.deleteBulk = function(keys) {
    tokens.forEach(this.delete, this);
};

BuiltinMap.prototype.delete = function(key) {
    if (key in this._store) {
        delete this._store[token];
        return true;
    } else {
        return false;
    }
};