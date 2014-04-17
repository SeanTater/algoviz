function HashtableMap() {
    // Create a new hash table that counts strings
    this.table = [];
    this.size = 16;
    this.entries = 0;
}

  
HashtableMap.prototype.populate =  function(tokens) {
    tokens.forEach(this.count, this);
};

HashtableMap.prototype.searchAll = function(tokens) {
    return tokens.map(function(key) {
        return this.table[this._getIndex(key)];
    }, this);
};

HashtableMap.prototype._getIndex = function(key) {
    return Math.abs(MurmurHash3.hashString(key, key.length, 0) | 0) % this.size;
};

HashtableMap.prototype.deleteBulk = function(keys) {
    tokens.map(this.delete, this);
};

HashtableMap.prototype.delete = function(key) {
    var entry = this.table[this._getIndex(key)];
    var key_index = entry.indexOf(key)
    if (key_index >= 0) {
        entry.splice(key_index, 1);
        return true;
    } else {
        return false;
    }
};

HashtableMap.prototype.count = function(key, value) {
    var entry = this.table[this._getIndex(key)];
    value |= 1;
    if (entry !== undefined) {
        if (entry[key] !== undefined) {
            // Already counted before
            entry[key] += value;
        } else {
            // Hash collision on this key
            entry[key] = value;
        }
    } else {
        // First instance of this key
        entry = this.table[hash] = {};
        entry[key] = value;
        this.entries++;
        
        if (this.entries > 0.75 * this.size) this.rehash();
    }
};

HashtableMap.prototype.rehash = function(){
    var old_table = this.table;
    var old_entries = this.entries;
    this.table = [];
    this.size *= 2;
    this.entries = 0;
    old_table.forEach(function(bucket){
        if (bucket !== undefined) {
            for (var key in bucket) {
                this.count(key, bucket[key]);
            }
        }
    }, this);
};