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
    if (node.element === key) {
        this.tree.removeNode(node);
        return true;
    } else {
        return false;
    }
};