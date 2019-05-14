import Block from '../blots/block';
import Container from '../blots/container';
import Quill from '../core/quill';
import {ClassAttributor, Scope} from '../parchment';

class ListItem extends Block {
	static create(value) {
		const node = super.create();
		node.setAttribute('data-list', value);
		return node;
	}

	static formats(domNode) {
		return domNode.getAttribute('data-list') || undefined;
	}

	static register() {
		Quill.register(ListContainer);
	}

	constructor(scroll, domNode) {
		super(scroll, domNode);
		const ui = domNode.ownerDocument.createElement('span');
		const listEventHandler = e => {
			if (!scroll.isEnabled()) return;
			const format = this.statics.formats(domNode, scroll);
			if (format === 'checked') {
				this.format('list', 'unchecked');
				e.preventDefault();
			} else if (format === 'unchecked') {
				this.format('list', 'checked');
				e.preventDefault();
			}
		};
		ui.addEventListener('mousedown', listEventHandler);
		ui.addEventListener('touchstart', listEventHandler);
		this.attachUI(ui);
	}

	format(name, value) {
		if (name === this.statics.blotName && value) {
			this.domNode.setAttribute('data-list', value);
		} else {
			super.format(name, value);
		}
	}
}
ListItem.blotName = 'list';
ListItem.tagName = 'LI';

class ListContainer extends Container {
	static create(value) {
		debugger;
		let tagName = value === 'ordered' ? 'OL' : 'UL';
		let node = super.create(tagName);
		if (value === 'checked' || value === 'unchecked') {
			node.setAttribute('data-checked', value === 'checked');
		}
		return node;
	}

	static formats(domNode) {
		debugger;
		if (domNode.tagName === 'OL') return 'ordered';
		if (domNode.tagName === 'UL') {
			if (domNode.hasAttribute('data-checked')) {
				return domNode.getAttribute('data-checked') === 'true' ? 'checked' : 'unchecked';
			} else {
				return 'bullet';
			}
		}
		return undefined;
	}

	constructor(...args) {
		debugger;
		console.log(args)
		super(...args);
		const listEventHandler = (e) => {
			if (e.target.parentNode !== this.domNode) return;
			let format = this.statics.formats(this.domNode);
			// let blot = Parchment.find(e.target);
			// if (format === 'checked') {
			// 	blot.format('list', 'unchecked');
			// } else if (format === 'unchecked') {
			// 	blot.format('list', 'checked');
			// }
		}

		this.domNode.addEventListener('touchstart', listEventHandler);
		this.domNode.addEventListener('mousedown', listEventHandler);
	}

	format(name, value) {
		debugger;
		if (this.children.length > 0) {
			this.children.tail.format(name, value);
		}
	}

	formats() {
		debugger;
		// We don't inherit from FormatBlot
		return {[this.statics.blotName]: this.statics.formats(this.domNode)};
	}

	insertBefore(blot, ref) {
		debugger;
		if (blot instanceof ListItem) {
			super.insertBefore(blot, ref);
		} else {
			let index = ref == null ? this.length() : ref.offset(this);
			let after = this.split(index);
			// after.parent.insertBefore(blot, after);
		}
	}

	optimize(context) {
		debugger;
		super.optimize(context);
		let next = this.next;
		if (next != null && next.prev === this &&
			next.statics.blotName === this.statics.blotName &&
			next.domNode.tagName === this.domNode.tagName &&
			next.domNode.getAttribute('data-checked') === this.domNode.getAttribute('data-checked')) {
			next.moveChildren(this);
			next.remove();
		}
	}

	replace(target) {
		debugger;
		if (target.statics.blotName !== this.statics.blotName) {
			// let item = Parchment.create(this.statics.defaultChild);
			// target.moveChildren(item);
			// this.appendChild(item);
		}
		super.replace(target);
	}
}
ListContainer.blotName = 'list-container';
ListContainer.tagName = ['OL', 'UL'];

ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;


export {ListContainer, ListItem as default};
