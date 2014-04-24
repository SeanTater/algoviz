function HashtableMap() {
    // Create a new hash table that counts strings
    this.table = []; // Array<Object>
    this.size = 16;
    this.entries = 0;
}

  
HashtableMap.prototype.populate =  function(tokens) {
    tokens.forEach(function(token){
        this.put(token, this.get(token)+1);
    }, this);
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
    keys.map(this.delete, this);
};

/**
 * Delete a key from the map.
 * @param key:String. The key to remove
 * @returns  boolean. Whether a key was removed
 */
HashtableMap.prototype.delete = function(key) {
    var entry = this.table[this._getIndex(key)];
    if (key in entry) {
        delete entry[key];
        return true;
    } else {
        return false;
    }
};

/** 
 * Set the value associated with key in the map
 * @param key:String. Key
 * @param value:int
 */
HashtableMap.prototype.put = function(key, value) {
    var hash = this._getIndex(key)
    var entry = this.table[hash];
    value |= 1;
    if (entry === undefined) {
        // First instance of this key
        entry = this.table[hash] = {};
        entry[key] = value;
        this.entries++;
        
        if (this.entries > 0.75 * this.size) this.rehash();
    } else {
        entry[key] = value;
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
                this.put(key, bucket[key]);
            }
        }
    }, this);
};

/** 
 * Get the value associated with key from the map
 * @param key:String. Key
 * @returns integer
 */
HashtableMap.prototype.get = function(key){
    var ent_dict = this.table[this._getIndex(key)];
    if (ent_dict === undefined || ent_dict[key] === undefined) {
        return 0;
    } else {
        return ent_dict[key];
    }
};