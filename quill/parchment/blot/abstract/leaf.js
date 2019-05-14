import Scope from '../../scope';
import ShadowBlot from './shadow';
export default class LeafBlot extends ShadowBlot {
	static value(_domNode) {
		return true;
	}

	index(node, offset) {
		if (this.domNode === node ||
			this.domNode.compareDocumentPosition(node) &
			Node.DOCUMENT_POSITION_CONTAINED_BY) {
			return Math.min(offset, 1);
		}
		return -1;
	}

	position(index, _inclusive) {
		const childNodes = Array.from(this.parent.domNode.childNodes);
		let offset = childNodes.indexOf(this.domNode);
		if (index > 0) {
			offset += 1;
		}
		return [this.parent.domNode, offset];
	}

	value() {
		return {
			[this.statics.blotName]: this.statics.value(this.domNode) || true,
		};
	}
}
LeafBlot.scope = Scope.INLINE_BLOT;
