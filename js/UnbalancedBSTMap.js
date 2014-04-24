function UnbalancedBSTMap() {
  // Create a _unbalanced_ BST that takes 2-entry objects
  this.tree = new buckets.BSTree(function(t1, t2){
    if (t1.token < t2.token) { return -1; }
    else if (t1.token > t2.token) { return 1; }
    else { return 0; }
  });
}

UnbalancedBSTMap.prototype.populate = function(tokens) {
  tokens.forEach(function(token){
    var node = this.tree.searchNode(this.tree.root, token);
    if (node == null) {
      this.tree.add({token: token, count: 1});
    } else {
      node.count += 1;
    }
  }, this);
};

/**
 * Search for many keys at once.
 * This can be more efficient than iterating.
 *
 * @param keys:Array<String>. Keys to search for
 * @returns Array<int>. Counts of each key
 */
UnbalancedBSTMap.prototype.searchAll = function(tokens) {
  return tokens.map(function(token){
    return this.tree.searchNode(this.tree.root, token).element;
  }, this);
};

/**
 * Delete many keys from the map at once.
 * This can be more efficient than iterating.
 * @param keys:Array<String>. Keys to delete
 * @returns Array<boolean>. Whether each key was deleted
 */
// TODO: Don't iterate.
UnbalancedBSTMap.prototype.deleteBulk = function(keys) {
    return keys.map(this.delete, this);
};

/**
 * Delete a key from the map.
 * @param key:String. The key to remove
 * @returns  boolean. Whether a key was removed
 */
UnbalancedBSTMap.prototype.delete = function(key) {
    var node = this.tree.searchNode(this.tree.root, key);
    if (node !== null && node.element.token === key) {
        this.tree.removeNode(node);
        return true;
    } else {
        return false;
    }
};

/** 
 * Get the value associated with key from the map
 * @param key:String. Key
 * @returns integer
 */
UnbalancedBSTMap.prototype.get = function(key){
    var node = this.tree.searchNode(this.tree.root, key);
    if (node.element.token === key) {
        return node.element.count;
    } else {
        return 0;
    }
};

/** 
 * Set the value associated with key in the map
 * @param key:String. Key
 * @param value:int
 * @returns integer
 */
UnbalancedBSTMap.prototype.put = function(key, value){
    var node = this.tree.searchNode(this.tree.root, key);
    if (node.element.token === key) {
        node.element.count = value;
    } else {
        this.tree.add({token: key, count: value});
    }
};