function BuiltinMap() {
    // Use a builtin object
    this._store = {}
}

/** 
 * Get the value associated with key from the map
 * @param key:String. Key
 * @returns integer
 */
BuiltinMap.prototype.get = function(key) {
    return this._store[key];
};

/** 
 * Set the value associated with key in the map
 * @param key:String. Key
 * @param value:int
 * @returns integer
 */
BuiltinMap.prototype.put = function(key, value) {
    this._store[key] = value;
    return true;
};

/**
 * Search for many keys at once.
 * This can be more efficient than iterating.
 *
 * @param keys:Array<String>. Keys to search for
 * @returns Array<int>. Counts of each key
 */
BuiltinMap.prototype.searchAll = function(tokens) {
    tokens.forEach(function(token){
        this._store[token];
    }, this);
};

/**
 * Make a histogram of the tokens
 * 
 * @param tokens:Array<String>. tokens to count
 */
BuiltinMap.prototype.populate = function(tokens) {
  tokens.forEach(function(token){
    this._store[token] = (this._store[token] | 0) + 1;
  }, this)
};

/**
 * Delete many keys from the map at once.
 * This can be more efficient than iterating.
 * @param keys:Array<String>. Keys to delete
 * @returns Array<boolean>. Whether each key was deleted
 */
BuiltinMap.prototype.deleteBulk = function(keys) {
    return keys.map(this.delete, this);
};

/**
 * Delete a key from the map.
 * @param key:String. The key to remove
 * @returns  boolean. Whether a key was removed
 */
BuiltinMap.prototype.delete = function(key) {
    if (key in this._store) {
        delete this._store[key];
        return true;
    } else {
        return false;
    }
};

/**
 * Generate a top-n ranking of a histogram
 * @param n length of the ranking
 * @returns the top-n keys ranked by value, descending
 */
BuiltinMap.prototype.top = function(n) {
    var entries = [];
    for (var word in this._store) {
        entries.push({word: word, count: this._store[word]});
    }
    entries.sort(function(a, b){ return b.count - a.count });
    return entries.slice(0, n);
}