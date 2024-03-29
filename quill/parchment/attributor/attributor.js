import Scope from '../scope';
export default class Attributor {
	constructor(attrName, keyName, options = {}) {
		this.attrName = attrName;
		this.keyName = keyName;
		const attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
		this.scope = options.scope != null ? (options.scope & Scope.LEVEL) | attributeBit : Scope.ATTRIBUTE;
		if (options.whitelist != null) {
			this.whitelist = options.whitelist;
		}
	}

	static keys(node) {
		return Array.from(node.attributes).map((item) => item.name);
	}

	add(node, value) {
		if (!this.canAdd(node, value)) {
			return false;
		}
		node.setAttribute(this.keyName, value);
		return true;
	}

	canAdd(_node, value) {
		if (this.whitelist == null) {
			return true;
		}
		if (typeof value === 'string') {
			return this.whitelist.indexOf(value.replace(/["']/g, '')) > -1;
		}
		else {
			return this.whitelist.indexOf(value) > -1;
		}
	}

	remove(node) {
		node.removeAttribute(this.keyName);
	}

	value(node) {
		const value = node.getAttribute(this.keyName);
		if (this.canAdd(node, value) && value) {
			return value;
		}
		return '';
	}
}
