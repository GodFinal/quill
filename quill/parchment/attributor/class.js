import Attributor from './attributor';
function match(node, prefix) {
	const className = node.getAttribute('class') || '';
	return className
		.split(/\s+/)
		.filter(name => name.indexOf(`${prefix}-`) === 0);
}
export default class ClassAttributor extends Attributor {
	constructor(...args){
		super(...args);
	}
	static keys(node) {
		return (node.getAttribute('class') || '').split(/\s+/).map(name => name
			.split('-')
			.slice(0, -1)
			.join('-'));
	}

	add(node, value) {
		if (!this.canAdd(node, value)) {
			return false;
		}
		this.remove(node);
		node.classList.add(`${this.keyName}-${value}`);
		return true;
	}

	remove(node) {
		const matches = match(node, this.keyName);
		matches.forEach(name => {
			node.classList.remove(name);
		});
		if (node.classList.length === 0) {
			node.removeAttribute('class');
		}
	}

	value(node) {
		const result = match(node, this.keyName)[0] || '';
		const value = result.slice(this.keyName.length + 1); // +1 for hyphen
		return this.canAdd(node, value) ? value : '';
	}
}
