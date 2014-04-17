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
};

BuiltinMap.prototype.deleteBulk = function(keys) {
    return keys.map(this.delete, this);
};

BuiltinMap.prototype.delete = function(key) {
    if (key in this._store) {
        delete this._store[key];
        return true;
    } else {
        return false;
    }
};

BuiltinMap.prototype.top = function(n) {
    var entries = [];
    for (var word in this._store) {
        entries.push({word: word, count: this._store[word]});
    }
    entries.sort(function(a, b){ return b.count - a.count });
    return entries.slice(0, n);
}