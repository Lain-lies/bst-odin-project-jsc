const print = console.log;

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function createNode(value) {
  return {
    data: value,
    left: null,
    right: null,
  };
}

class Tree {
  constructor() {
    this.root = null;
  }

  buildTree(array) {
    array = array.sort((a, b) => a - b);
    this.root = this.buildTreeRecursiveHelper(array, 0, array.length - 1);
  }

  buildTreeRecursiveHelper(array, start, end) {

    if(start > end) return null;

    const mid = Math.floor((end + start) / 2); 
    const temp = createNode(array[mid]);

    temp.left = this.buildTreeRecursiveHelper(array, start, mid - 1);
    temp.right = this.buildTreeRecursiveHelper(array, mid + 1, end);

    return temp;

  }

  getRoot(){
    return this.root;
  }
}

const tree = new Tree();
tree.buildTree([3,2,1]);
prettyPrint(tree.getRoot());
