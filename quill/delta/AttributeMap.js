import equal from '../deep-equal';
import extend from '../extend';

export default class AttributeMap {
	static compose(a = {}, b = {}, keepNull) {
		if (typeof a !== 'object') {
			a = {};
		}
		if (typeof b !== 'object') {
			b = {};
		}
		let attributes = extend(true, {}, b);
		if (!keepNull) {
			attributes = Object.keys(attributes).reduce((copy, key) => {
				if (attributes[key] != null) {
					copy[key] = attributes[key];
				}
				return copy;
			}, {});
		}
		for (const key in a) {
			if (a[key] !== undefined && b[key] === undefined) {
				attributes[key] = a[key];
			}
		}
		return Object.keys(attributes).length > 0 ? attributes : undefined;
	}
	
	static diff(a = {}, b = {}) {
		if (typeof a !== 'object') {
			a = {};
		}
		if (typeof b !== 'object') {
			b = {};
		}
		const attributes = Object.keys(a)
			.concat(Object.keys(b))
			.reduce((attrs, key) => {
				if (!equal(a[key], b[key])) {
					attrs[key] = b[key] === undefined ? null : b[key];
				}
				return attrs;
			}, {});
		return Object.keys(attributes).length > 0 ? attributes : undefined;
	}

	static invert(attr = {}, base = {}) {
		attr = attr || {};
		const baseInverted = Object.keys(base).reduce((memo, key) => {
			if (base[key] !== attr[key] && attr[key] !== undefined) {
				memo[key] = base[key];
			}
			return memo;
		}, {});
		return Object.keys(attr).reduce((memo, key) => {
			if (attr[key] !== base[key] && base[key] === undefined) {
				memo[key] = null;
			}
			return memo;
		}, baseInverted);
	}

	static transform(a, b, priority = false) {
		if (typeof a !== 'object') {
			return b;
		}
		if (typeof b !== 'object') {
			return undefined;
		}
		if (!priority) {
			return b; // b simply overwrites us without priority
		}
		const attributes = Object.keys(b).reduce((attrs, key) => {
			if (a[key] === undefined) {
				attrs[key] = b[key]; // null is a valid value
			}
			return attrs;
		}, {});
		return Object.keys(attributes).length > 0 ? attributes : undefined;
	}
};
