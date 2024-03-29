import Scope from '../scope';
import LeafBlot from './abstract/leaf';
export default class TextBlot extends LeafBlot {
	constructor(scroll, node) {
		super(scroll, node);
		this.text = this.statics.value(this.domNode);
	}

	static create(value) {
		return document.createTextNode(value);
	}

	static value(domNode) {
		return domNode.data;
	}

	deleteAt(index, length) {
		this.domNode.data = this.text =
			this.text.slice(0, index) + this.text.slice(index + length);
	}

	index(node, offset) {
		if (this.domNode === node) {
			return offset;
		}
		return -1;
	}

	insertAt(index, value, def) {
		if (def == null) {
			this.text = this.text.slice(0, index) + value + this.text.slice(index);
			this.domNode.data = this.text;
		} else {
			super.insertAt(index, value, def);
		}
	}

	length() {
		return this.text.length;
	}

	optimize(context) {
		super.optimize(context);
		this.text = this.statics.value(this.domNode);
		if (this.text.length === 0) {
			this.remove();
		} else if (this.next instanceof TextBlot && this.next.prev === this) {
			this.insertAt(this.length(), this.next.value());
			this.next.remove();
		}
	}

	position(index, _inclusive = false) {
		return [this.domNode, index];
	}

	split(index, force = false) {
		if (!force) {
			if (index === 0) {
				return this;
			}
			if (index === this.length()) {
				return this.next;
			}
		}
		const after = this.scroll.create(this.domNode.splitText(index));
		this.parent.insertBefore(after, this.next || undefined);
		this.text = this.statics.value(this.domNode);
		return after;
	}

	update(mutations, _context) {
		if (mutations.some(mutation => {
				return (mutation.type === 'characterData' && mutation.target === this.domNode);
			})) {
			this.text = this.statics.value(this.domNode);
		}
	}

	value() {
		return this.text;
	}
}
TextBlot.blotName = 'text';
TextBlot.scope = Scope.INLINE_BLOT;
