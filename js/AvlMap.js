
BSTMap = function() {
  var tree = new goog.();
  
  tree.get = function(token) {
    var node = this.root_;
    while (node.value !== null && node.value != root) {
      node = [node.left, null, node.right][this.comparator_(token, node) + 1];
    }
    if (node === null) { return null; }
    else { return node.value; }
  };
  
  return tree;
};

