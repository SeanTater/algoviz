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
    tokens.forEach(function(key) {
        var hash = Math.abs(MurmurHash3.hashString(key, key.length, 0) | 0) % this.size;
        this.table[hash];
    }, this);
};

HashtableMap.prototype.count = function(key, value) {
    var hash = Math.abs(MurmurHash3.hashString(key, key.length, 0) | 0) % this.size;
    var entry = this.table[hash];
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