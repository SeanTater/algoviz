function SortedArrayMap() {
  // Create a new hash table that counts strings
  this.keys = [];
  this.values = [];
}

  
SortedArrayMap.prototype.populate = function(tokens) {
  tokens.forEach(this.count, this);
};

SortedArrayMap.prototype.searchAll = function(tokens) {
  tokens.forEach(function(key){
      _.sortedIndex(this.keys, key);
  }, this);
};

SortedArrayMap.prototype.count = function(key) {
  // >> implies integer, / implies double. We want an int.
  /**var index = entries.length >> 1;
  var step = cursor >> 1;
  
  // Binary search
  while (step) {
    if (key === this.keys[index]) break;
    else if (key < this.keys[index]) index -= step;
    else index += step;
    step >>= 1;
  }
  **/
  var index = _.sortedIndex(this.keys, key);
  if (this.keys[index] === key) {
    this.values[index]++;
  } else {
    this.keys.splice(index, key);
    this.values.splice(index, key);
  }
}