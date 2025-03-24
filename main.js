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
    if (start > end) return null;

    const mid = Math.floor((end + start) / 2);
    const temp = createNode(array[mid]);
    console.log(mid);
    console.log(array);
    print(temp.data);
    temp.left = this.buildTreeRecursiveHelper(array, start, mid - 1);
    temp.right = this.buildTreeRecursiveHelper(array, mid + 1, end);

    return temp;
  }

  getRoot() {
    return this.root;
  }

  insert(value) {

    const newNode = createNode(value);
    let currentNode = this.root;

    while (true) {
      if (this.root === null) return null;

      let smaller;
      if(newNode.data === currentNode.data) return null;
      newNode.data < currentNode.data ? (smaller = true) : (smaller = false);

      if (smaller) {
        if (currentNode.left === null) {
          currentNode.left = newNode;
          return;
        }

        currentNode = currentNode.left;
        continue;

      } else {
        if (currentNode.right === null) {
          currentNode.right = newNode;
          return;
        }

        currentNode = currentNode.right;
        continue;
      }
    }
  }
}
const numbers = [15, 10, 20, 8, 12, 18, 25, 6, 9, 11];

const tree = new Tree();

tree.buildTree(numbers);
prettyPrint(tree.getRoot());
tree.insert(20);
prettyPrint(tree.getRoot());
