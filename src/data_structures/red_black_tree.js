// Exported for the tests :(
import BinarySearchTree from "./binary_search_tree";
export class RBTNode {
  static BLACK = "black";
  static RED = "red";
  static sentinel = Object.freeze({ color: RBTNode.BLACK });

  constructor({
    key,
    value,
    color = RBTNode.RED,
    parent = RBTNode.sentinel,
    left = RBTNode.sentinel,
    right = RBTNode.sentinel,
  }) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class RedBlackTree {
  constructor(Node = RBTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  lookup(key) {
    if (!this._root) {
      return undefined;
    }
    let node = this._root;
    while (node.key) {
      if (key > node.key) {
        node = node.right;
      } else if (key < node.key) {
        node = node.left;
      } else {
        return node.value;
      }
    }
    return undefined;
  }

  /**
   * The two rotation functions are symetric, and could presumably
   * be collapsed into one that takes a direction 'left' or 'right',
   * calculates the opposite, and uses [] instead of . to access.
   *
   * Felt too confusing to be worth it. Plus I bet* the JIT optimizes two
   * functions with static lookups better than one with dynamic lookups.
   *
   * (*without any evidence whatsoever, 10 points to anyone who tries it out)
   */
  _rotateLeft(node) {
    const child = node.right;

    if (node === RBTNode.sentinel) {
      throw new Error("Cannot rotate a sentinel node");
    } else if (child === RBTNode.sentinel) {
      throw new Error("Cannot rotate away from a sentinel node");
    }

    // turn child's left subtree into node's right subtree
    node.right = child.left;
    if (child.left !== RBTNode.sentinel) {
      child.left.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // put node on child's left
    child.left = node;
    node.parent = child;

    // LOOK AT ME
    // I'M THE PARENT NOW
  }

  _rotateRight(node) {
    const child = node.left;

    if (node === RBTNode.sentinel) {
      throw new Error("Cannot rotate a sentinel node");
    } else if (child === RBTNode.sentinel) {
      throw new Error("Cannot rotate away from a sentinel node");
    }

    // turn child's right subtree into node's left subtree
    node.left = child.right;
    if (child.right !== RBTNode.sentinel) {
      child.right.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.right) {
      node.parent.right = child;
    } else {
      node.parent.left = child;
    }

    // put node on child's right
    child.right = node;
    node.parent = child;
  }

  _insertInternal(key, value = true) {
    let newNode;
    let node = this._root;
    newNode = new RBTNode({
      key,
      value,
    });

    if (!node) {
      this._root = newNode;
      this._root.color = RBTNode.BLACK;
      this._count += 1;
      return newNode;
    }

    let parent = node.parent;
    while (node.key) {
      if (key < node.key) {
        parent = node;
        node = node.left;
      } else if (key > node.key) {
        parent = node;
        node = node.right;
      } else {
        node.value = value;
        return node;
      }
    }
    newNode = new RBTNode({
      key,
      value,
      parent,
    });

    this._count += 1;

    if (newNode.key < parent.key) {
      parent.left = newNode;
      return newNode;
    }
    parent.right = newNode;
    return newNode;
  }

  _insertRebalance(node) {
    while (node.color === RBTNode.RED && node.parent.color === RBTNode.RED) {
      const parent = node.parent;
      const grandparent = parent.parent;
      const parentIsLeftChild = parent.key < grandparent.key;
      const uncle = parentIsLeftChild ? grandparent.right : grandparent.left;
      if (uncle.color === RBTNode.RED) {
        parent.color = RBTNode.BLACK;
        uncle.color = RBTNode.BLACK;
        grandparent.color = RBTNode.RED;
        node = grandparent;
      } else {
        if (parentIsLeftChild) {
          if (node.key < parent.key) {
            parent.color = RBTNode.BLACK;
            grandparent.color = RBTNode.RED;
            this._rotateRight(grandparent);
          } else {
            this._rotateLeft(parent);
            node = parent;
          }
        } else {
          if (node.key > parent.key) {
            parent.color = RBTNode.BLACK;
            grandparent.color = RBTNode.RED;
            this._rotateLeft(grandparent);
          } else {
            this._rotateRight(parent);
            node = parent;
          }
        }
      }
      this._root.color = RBTNode.BLACK;
    }
  }

  insert(key, value) {
    const node = this._insertInternal(key, value);
    this._insertRebalance(node);
  }

  delete(key) {}

  count() {
    return this._count;
  }

  forEach(callback) {
    const visitSubtree = (node, callback, i = 0) => {
      if (node && node.key) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    };
    visitSubtree(this._root, callback);
  }
}

export default RedBlackTree;
