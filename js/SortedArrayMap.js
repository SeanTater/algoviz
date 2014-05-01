/**
 * Create a key - value store using parallel sorted arrays
 * 
 * interface Map {
 *     boolean function delete(String key)
 *     Array<boolean> function deleteBulk(Array<String> keys)
 *     int get(String key)
 *     undefined function populate(Array<String> keys)
 *     undefined put(String key, int value)
 *     Array<int> function searchAll(Array<String> keys)
 * }
 */
function SortedArrayMap() {
    // Create a new hash table that counts strings
    this._keys = [];
    this._values = [];
}

/**
 * Count one token, as part of a histogram
 * 
 * @param key:String. The token to count
 */
SortedArrayMap.prototype.count = function(key) {
    // >> implies integer, / implies double. We want an int.
    /**var index = entries.length >> 1;
     * var step = cursor >> 1;
     * 
     * // Binary search
     * while (step) {
     *  if (key === this.keys[index]) break;
     *  else if (key < this.keys[index]) index -= step;
     *  else index += step;
     *  step >>= 1;
}
**/
    var index = _.sortedIndex(this._keys, key);
    if (this._keys[index] === key) {
        this._values[index]++;
    } else {
        this._keys.splice(index, 0, key);
        this._values.splice(index, 0, 1);
    }
};

/**
 * Delete a key from the map.
 * @param key:String. The key to remove
 * @returns  boolean. Whether a key was removed
 */
SortedArrayMap.prototype.delete = function(key) {
    var index = _.sortedIndex(this._keys, key);
    if (this._keys[index] === key) {
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        return true;
    } else {
        return false;
    }
};

/**
 * Delete many keys from the map at once.
 * This can be more efficient than iterating.
 * @param keys:Array<String>. Keys to delete
 * @returns Array<boolean>. Whether each key was deleted
 */
// TODO: Don't iterate.
SortedArrayMap.prototype.deleteBulk = function(keys) {
    return keys.map(this.delete, this);
};

/** 
 * Get the value associated with key from the map
 * @param key:String. Key
 * @returns integer
 */
SortedArrayMap.prototype.get = function(key){
    var index = _.sortedIndex(this._keys, key);
    var closest_key = this._keys[index];
    if (closest_key === key) {
        return this._values[index];
    } else {
        return 0;
    }
};

/**
 * Procedure for insertion into an array, shifting the remaining elements
 * (e.g. array[index] = value) when the precedure is complete.
 * 
 * This procedure is intentially unoptimized, not using splice(). This is to
 * give a fairer comparison of speed.
 * @param array:Array. The array to insert into
 * @param index:int. Insert the new element before this index.
 * @param value:any. The new element to insert
 */
SortedArrayMap.prototype.insert = function(array, index, value) {
    for (var i=array.length; i>index; i--) {
        array[i] = array[i-1];
    }
    array[index] = value;
}

/** 
 * Set the value associated with key in the map
 * @param key:String. Key
 * @param value:int
 * @returns integer
 */
SortedArrayMap.prototype.put = function(key, value){
    var index = _.sortedIndex(this._keys, key);
    var closest_key = this._keys[index];
    if (closest_key === key) {
        this._values[index] = value;
    } else {
        this.insert(this._keys, index, key);
        this.insert(this._values, index, value);
    }
};

/**
 * Make a histogram of the tokens
 * 
 * @param tokens:Array<String>. tokens to count
 */
SortedArrayMap.prototype.populate = function(tokens) {
    tokens.forEach(this.count, this);
};

/**
 * Search for many keys at once.
 * This can be more efficient than iterating.
 *
 * @param keys:Array<String>. Keys to search for
 * @returns Array<int>. Counts of each key
 */
//TODO: Search in order, use a linear search maybe?
SortedArrayMap.prototype.searchAll = function(keys) {
    return keys.map(this.get, this);
};
