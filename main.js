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
    print(array);
    this.root = this.buildTreeRecursiveHelper(array, 0, array.length - 1);
  }

  buildTreeRecursiveHelper(array, start, end) {
    if (start > end) return null;

    const mid = Math.floor((end + start) / 2);
    const temp = createNode(array[mid]);
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
      if (newNode.data === currentNode.data) return null;
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

  delete(value) {
    let cursor = this.getRoot();
    let node = cursor;
    let smaller;
    let flag = true;

    if (value === cursor.data) {
      flag = false;
      smaller = null;
    }

    while (flag) {
      print("test");
      if (cursor === null) {
        print(null);
        return null;
      }

      if (cursor.left !== null && cursor.left.data === value) {
        node = cursor.left;
        smaller = true;
        print(1);
        break;
      } else if (cursor.right !== null && cursor.right.data === value) {
        node = cursor.right;
        smaller = false;
        print(2);
        break;
      }

      if (value < cursor.data) cursor = cursor.left;
      else cursor = cursor.right;
    }

    switch (this.checkChildrenNum(node)) {
      case 0:
        this.noChildDeleteHelper(cursor, smaller);
        break;

      case 1:
        this.oneChildDeleteHelper(cursor, node, smaller);
        break;

      case 2:
        this.twoChildDeleteHelper(cursor, node, smaller);
        break;
    }
  }

  checkChildrenNum(node) {
    let n = 0;

    if (node.left != null) n++;
    if (node.right != null) n++;

    print(node);
    print(`n is ${n}`);
    return n;
  }

  noChildDeleteHelper(cursor, smaller) {
    if (smaller) cursor.left = null;
    else cursor.right = null;
  }

  oneChildDeleteHelper(cursor, node, smaller) {
    let nodeChild = null;
    print(cursor);
    print(node);

    if (node.left !== null) nodeChild = node.left;
    else nodeChild = node.right;

    if (smaller) cursor.left = nodeChild;
    else cursor.right = nodeChild;

    return;
  }

  twoChildDeleteHelper(parent, nodeForDeletion, smaller) {
    print("two child helper");
    let rightNode = nodeForDeletion.right;

    if (this.isLeaf(rightNode)) {

      rightNode.left = nodeForDeletion.left;

      if(smaller === true)
        parent.left = rightNode;
      else if(smaller === false)
        parent.right = rightNode
      else
        this.root = rightNode
      
      return;
    }

    while (true) {
      if (currentNode.left.left === null) break;

      currentNode = currentNode.left;
    }

    const chosenNode = currentNode.left;
    const chosenNodeRightTree = chosenNode.right;

    currentNode.left = chosenNodeRightTree;

    chosenNode.left = node.left;
    chosenNode.right = node.right;

    if (smaller === true) cursor.left = chosenNode;
    else if (smaller === false) cursor.right = chosenNode;
    else this.root = chosenNode;
  }

  isLeaf(node) {
    if (node.left === null && node.right === null) return true;
    return false;
  }
}
const numbers = [50, 30, 20, 40, 32, 34, 36, 70, 60, 65, 80, 75, 85];

const tree = new Tree();

tree.buildTree(numbers);
prettyPrint(tree.getRoot());
tree.delete(50);
prettyPrint(tree.getRoot());
