import ParchmentError from '../../error';
import Registry from '../../registry';
import Scope from '../../scope';
export default class ShadowBlot {
	constructor(scroll, domNode) {
		this.scroll = scroll;
		this.domNode = domNode;
		Registry.blots.set(domNode, this);
		this.prev = null;
		this.next = null;
	}

	static create(value) {
		if (this.tagName == null) {
			throw new ParchmentError('Blot definition missing tagName');
		}
		let node;
		if (Array.isArray(this.tagName)) {
			if (typeof value === 'string') {
				value = value.toUpperCase();
				if (parseInt(value, 10).toString() === value) {
					value = parseInt(value, 10);
				}
			}
			if (typeof value === 'number') {
				node = document.createElement(this.tagName[value - 1]);
			} else if (this.tagName.indexOf(value) > -1) {
				node = document.createElement(value);
			} else {
				node = document.createElement(this.tagName[0]);
			}
		} else {
			node = document.createElement(this.tagName);
		}
		if (this.className) {
			node.classList.add(this.className);
		}
		return node;
	}

	// Hack for accessing inherited static methods
	get statics() {
		return this.constructor;
	}

	attach() {
		// Nothing to do
	}

	clone() {
		const domNode = this.domNode.cloneNode(false);
		return this.scroll.create(domNode);
	}

	detach() {
		if (this.parent != null) {
			this.parent.removeChild(this);
		}
		Registry.blots.delete(this.domNode);
	}

	deleteAt(index, length) {
		const blot = this.isolate(index, length);
		blot.remove();
	}

	formatAt(index, length, name, value) {
		const blot = this.isolate(index, length);
		if (this.scroll.query(name, Scope.BLOT) != null && value) {
			blot.wrap(name, value);
		} else if (this.scroll.query(name, Scope.ATTRIBUTE) != null) {
			const parent = this.scroll.create(this.statics.scope);
			blot.wrap(parent);
			parent.format(name, value);
		}
	}

	insertAt(index, value, def) {
		const blot = def == null
			? this.scroll.create('text', value)
			: this.scroll.create(value, def);
		const ref = this.split(index);
		this.parent.insertBefore(blot, ref || undefined);
	}

	isolate(index, length) {
		const target = this.split(index);
		if (target == null) {
			throw new Error('Attempt to isolate at end');
		}
		target.split(length);
		return target;
	}

	length() {
		return 1;
	}

	offset(root = this.parent) {
		if (this.parent == null || this === root) {
			return 0;
		}
		return this.parent.children.offset(this) + this.parent.offset(root);
	}

	optimize(_context) {
		if (this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer)) {
			this.wrap(this.statics.requiredContainer.blotName);
		}
	}

	remove() {
		if (this.domNode.parentNode != null) {
			this.domNode.parentNode.removeChild(this.domNode);
		}
		this.detach();
	}

	replaceWith(name, value) {
		const replacement = typeof name === 'string' ? this.scroll.create(name, value) : name;
		if (this.parent != null) {
			this.parent.insertBefore(replacement, this.next || undefined);
			this.remove();
		}
		return replacement;
	}

	split(index, _force) {
		return index === 0 ? this : this.next;
	}

	update(_mutations, _context) {
		// Nothing to do by default
	}

	wrap(name, value) {
		const wrapper = typeof name === 'string'
			? this.scroll.create(name, value)
			: name;
		if (this.parent != null) {
			this.parent.insertBefore(wrapper, this.next || undefined);
		}
		if (typeof wrapper.appendChild !== 'function') {
			throw new ParchmentError(`Cannot wrap ${name}`);
		}
		wrapper.appendChild(this);
		return wrapper;
	}
}
ShadowBlot.blotName = 'abstract';

