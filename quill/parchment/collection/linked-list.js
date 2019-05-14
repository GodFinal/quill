export default class LinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
		this.head = null;
		this.tail = null;
		this.length = 0;
	}

	append(...nodes) {
		this.insertBefore(nodes[0], null);
		if (nodes.length > 1) {
			this.append.apply(this, nodes.slice(1));
		}
	}

	at(index) {
		const next = this.iterator();
		let cur = next();
		while (cur && index > 0) {
			index -= 1;
			cur = next();
		}
		return cur;
	}

	contains(node) {
		const next = this.iterator();
		let cur = next();
		while (cur) {
			if (cur === node) {
				return true;
			}
			cur = next();
		}
		return false;
	}

	indexOf(node) {
		const next = this.iterator();
		let cur = next();
		let index = 0;
		while (cur) {
			if (cur === node) {
				return index;
			}
			index += 1;
			cur = next();
		}
		return -1;
	}

	insertBefore(node, refNode) {
		if (node == null) {
			return;
		}
		this.remove(node);
		node.next = refNode;
		if (refNode != null) {
			node.prev = refNode.prev;
			if (refNode.prev != null) {
				refNode.prev.next = node;
			}
			refNode.prev = node;
			if (refNode === this.head) {
				this.head = node;
			}
		} else if (this.tail != null) {
			this.tail.next = node;
			node.prev = this.tail;
			this.tail = node;
		} else {
			node.prev = null;
			this.head = this.tail = node;
		}
		this.length += 1;
	}

	offset(target) {
		let index = 0;
		let cur = this.head;
		while (cur != null) {
			if (cur === target) {
				return index;
			}
			index += cur.length();
			cur = cur.next;
		}
		return -1;
	}

	remove(node) {
		if (!this.contains(node)) {
			return;
		}
		if (node.prev != null) {
			node.prev.next = node.next;
		}
		if (node.next != null) {
			node.next.prev = node.prev;
		}
		if (node === this.head) {
			this.head = node.next;
		}
		if (node === this.tail) {
			this.tail = node.prev;
		}
		this.length -= 1;
	}

	iterator(curNode = this.head) {
		// TODO use yield when we can
		return () => {
			const ret = curNode;
			if (curNode != null) {
				curNode = curNode.next;
			}
			return ret;
		};
	}

	find(index, inclusive = false) {
		const next = this.iterator();
		let cur = next();
		while (cur) {
			const length = cur.length();
			if (index < length ||
				(inclusive &&
				index === length &&
				(cur.next == null || cur.next.length() !== 0))) {
				return [cur, index];
			}
			index -= length;
			cur = next();
		}
		return [null, 0];
	}

	forEach(callback) {
		const next = this.iterator();
		let cur = next();
		while (cur) {
			callback(cur);
			cur = next();
		}
	}

	forEachAt(index, length, callback) {
		if (length <= 0) {
			return;
		}
		const [startNode, offset] = this.find(index);
		let curIndex = index - offset;
		const next = this.iterator(startNode);
		let cur = next();
		while (cur && curIndex < index + length) {
			const curLength = cur.length();
			if (index > curIndex) {
				callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
			} else {
				callback(cur, 0, Math.min(curLength, index + length - curIndex));
			}
			curIndex += curLength;
			cur = next();
		}
	}

	map(callback) {
		return this.reduce((memo, cur) => {
			memo.push(callback(cur));
			return memo;
		}, []);
	}

	reduce(callback, memo) {
		const next = this.iterator();
		let cur = next();
		while (cur) {
			memo = callback(memo, cur);
			cur = next();
		}
		return memo;
	}
}
