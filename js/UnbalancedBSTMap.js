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