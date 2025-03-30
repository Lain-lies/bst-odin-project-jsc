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
    let cursorParent = this.getRoot();
    let smaller = null;
    let flag;

    // EARLY EXIT IF ROOT
    cursor.data === value ? (flag = false) : (flag = true);

    while (flag) {
      if (cursor.data === value) {
        value < cursorParent.data ? (smaller = true) : (smaller = false);
        break;
      }

      cursorParent = cursor;

      value < cursor.data ? (cursor = cursor.left) : (cursor = cursor.right);
    }

    switch (this.checkChildrenNum(cursor)) {
      case 0:
        this.noChildDeleteHelper(cursorParent, smaller);
        break;

      case 1:
        this.oneChildDeleteHelper(cursorParent, cursor, smaller);
        break;

      case 2:
        this.twoChildDeleteHelper(cursorParent, cursor, smaller);
        break;

      default:
        return null;
    }
  }

  checkChildrenNum(node) {
    let n = 0;

    if (node.left != null) n++;
    if (node.right != null) n++;

    return n;
  }

  noChildDeleteHelper(parent, smaller) {
    smaller ? (parent.left = null) : (parent.right = null);
  }

  oneChildDeleteHelper(parent, nodeForDeletion, smaller) {
    let childOfDeletedNode;

    nodeForDeletion.left !== null
      ? (childOfDeletedNode = nodeForDeletion.left)
      : (childOfDeletedNode = nodeForDeletion.right);

    if (smaller === true) parent.left = childOfDeletedNode;
    else if (smaller === false) parent.right = childOfDeletedNode;
    else this.root = childOfDeletedNode;

    return;
  }

  twoChildDeleteHelper(parent, nodeForDeletion, smaller) {
    const rightNode = nodeForDeletion.right;

    if (this.isLeaf(rightNode)) {
      rightNode.left = nodeForDeletion.left;

      if (smaller === true) parent.left = rightNode;
      else if (smaller === false) parent.right = rightNode;
      else this.root = rightNode;

      return;
    }

    let smallestNodeParent = rightNode;
    let smallestNode = rightNode.left;

    while (smallestNode.left !== null) {
      smallestNodeParent = smallestNode;
      smallestNode = smallestNode.left;
    }

    smallestNodeParent.left = smallestNode.right;

    smallestNode.left = nodeForDeletion.left;
    smallestNode.right = nodeForDeletion.right;

    if (smaller === true) parent.left = smallestNode;
    else if (smaller === false) parent.right = smallestNode;
    else this.root = smallestNode;
  }

  isLeaf(node) {
    if (node.left === null && node.right === null) return true;
    return false;
  }

  find(value) {
    let cursor = this.getRoot();
    if (!cursor) return null;

    while (cursor != null) {
      if (value === cursor.data) return cursor;

      value < cursor.data ? (cursor = cursor.left) : (cursor = cursor.right);
    }

    return null;
  }

  levelOrder(callback) {
    if (callback === undefined) throw new Error("Callback function required");
    const queue = [this.getRoot()];
    while (queue.length != 0) {
      let current = queue[0];
      callback(current.data);

      if (current.left != null) queue.push(current.left);
      if (current.right != null) queue.push(current.right);

      queue.shift();
    }
  }

  preOrder(callback) {
    let root = this.getRoot();

    function preOrderRecursiveHelper(node) {
      if (node === null) return;

      callback(node.data);
      preOrderRecursiveHelper(node.left);
      preOrderRecursiveHelper(node.right);
    }

    preOrderRecursiveHelper(root);
  }

  inOrder(callback) {
    let root = this.getRoot();

    function inOrderRecursiveHelper(node) {
      if (node === null) return;

      inOrderRecursiveHelper(node.left);
      callback(node.data);
      inOrderRecursiveHelper(node.right);
    }

    inOrderRecursiveHelper(root);
  }

  postOrder(callback) {
    let root = this.getRoot();

    function postOrderRecursiveHelper(node) {
      if (node === null) return;

      postOrderRecursiveHelper(node.left);
      postOrderRecursiveHelper(node.right);
      callback(node.data);
    }

    postOrderRecursiveHelper(root);
  }

  height(node) {
    if (node === null) return;
    let left = 0,
      right = 0;

    if (node.left !== null) {
      left++;
      left += this.height(node.left);
    }

    if (node.right !== null) {
      right++;
      right += this.height(node.right);
    }

    return left > right ? left : right;
  }

  depth(node) {
    if (!this.find(node.data)) throw new Error("Node not in tree");
    if (node === null) return;

    let cursor = this.getRoot();
    let depth = 0;

    while (true) {
      if (cursor.data === node.data) break;

      node.data < cursor.data
        ? (cursor = cursor.left)
        : (cursor = cursor.right);

      depth++;
    }
    return depth;
  }

  isBalanced() {
    const root = this.getRoot();
    if (this.isLeaf(root)) return true;

    let left = 0,
      right = 0;
    if (root.left !== null) left = this.height(root.left);
    if (root.right !== null) right = this.height(root.right);

    let balanced = left - right;

    //turn to absolute value
    if (balanced < 0) balanced *= -1;

    return balanced > 1 ? false : true;
  }

  rebalance() {
    if (this.isBalanced()) return;
    const sorted = [];
    this.preOrder((value) => sorted.push(value));
    this.buildTree(sorted);
  }
}

const numbers = [50, 30, 20, 40, 32, 34, 36, 70, 60, 65, 80, 75, 85];

const tree = new Tree();

tree.buildTree(numbers);
tree.insert(100);
tree.insert(101);
tree.insert(102);
prettyPrint(tree.getRoot());
tree.rebalance();
prettyPrint(tree.getRoot());
