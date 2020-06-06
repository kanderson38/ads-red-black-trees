class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  insert(key, value = true) {
    let node = this._root;
    let parent = undefined;
    while (node) {
      parent = node;
      if (key < node.key) {
        node = node.left;
        parent.left = node;
      } else if (key > node.key) {
        node = node.right;
        parent.right = node;
      } else {
        node.value = value;
        return;
      }
    }
    node = new BSTNode({ key, value, parent, undefined, undefined });

    this._count += 1;
    if (!parent) {
      this._root = node;
      return;
    }
    if (node.key < parent.key) {
      parent.left = node;
      return;
    }
    parent.right = node;
  }

  lookup(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else {
        // equal
        return node.value;
      }
    }
  }

  delete(key) {
    let node = this._root;
    let parent;
    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else {
        parent = node.parent;
        break;
      }
    }
    if (node) {
      this._count -= 1;
      let leftOrphan = node.left;
      let rightOrphan = node.right;
      if (!leftOrphan && !rightOrphan) {
        if (parent) {
          if (parent.left === node) {
            parent.left = undefined;
          } else {
            parent.right = undefined;
          }
        } else {
          this._root = undefined;
        }
        return node.value;
      }
      if (leftOrphan) {
        // follow path to rightmost node of left orphan
        if (rightOrphan) {
          while (leftOrphan.right) {
            leftOrphan = leftOrphan.right;
          }
          leftOrphan.right = rightOrphan;

          rightOrphan.parent = leftOrphan;

          if (leftOrphan.left && leftOrphan.parent != parent) {
            leftOrphan.parent.right = leftOrphan.left;
          }
        }
        if (parent) {
          if (parent.left === node) {
            parent.left = leftOrphan;
          } else {
            parent.right = leftOrphan;
          }
        } else {
          this._root = leftOrphan;
        }
        leftOrphan.parent = parent;
      } else if (rightOrphan) {
        if (parent) {
          if (parent.left === node) {
            parent.left = rightOrphan;
          } else {
            parent.right = rightOrphan;
          }
        } else {
          this._root = rightOrphan;
        }
        rightOrphan.parent = parent;
      }
      return node.value;
    }
    return undefined;
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    };
    visitSubtree(this._root, callback);
  }
}

export default BinarySearchTree;
