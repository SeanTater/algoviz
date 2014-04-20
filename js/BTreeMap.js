
function BTreeMap() {
    this.root = new BTreeNode(null);
};

BTreeMap.NODE_COUNT = 16;

function BTreeNode(parent) {
    this.parent = parent;
    this.links = [];
};

BTreeMap.prototype.get(key) {
    
};


