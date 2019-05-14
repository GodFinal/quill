import Attributor from './attributor';
function camelize(name) {
	const parts = name.split('-');
	const rest = parts
		.slice(1)
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join('');
	return parts[0] + rest;
}
export default class StyleAttributor extends Attributor {
	static keys(node) {
		return (node.getAttribute('style') || '').split(';').map(value => {
			const arr = value.split(':');
			return arr[0].trim();
		});
	}

	add(node, value) {
		if (!this.canAdd(node, value)) {
			return false;
		}
		// @ts-ignore
		node.style[camelize(this.keyName)] = value;
		return true;
	}

	remove(node) {
		// @ts-ignore
		node.style[camelize(this.keyName)] = '';
		if (!node.getAttribute('style')) {
			node.removeAttribute('style');
		}
	}

	value(node) {
		// @ts-ignore
		const value = node.style[camelize(this.keyName)];
		return this.canAdd(node, value) ? value : '';
	}
}
