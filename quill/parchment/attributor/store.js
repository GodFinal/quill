import Registry from '../registry';
import Scope from '../scope';
import Attributor from './attributor';
import ClassAttributor from './class';
import StyleAttributor from './style';
export default class AttributorStore {
	constructor(domNode) {
		this.attributes = {};
		this.domNode = domNode;
		this.build();
	}

	attribute(attribute, value) {
		// verb
		if (value) {
			if (attribute.add(this.domNode, value)) {
				if (attribute.value(this.domNode) != null) {
					this.attributes[attribute.attrName] = attribute;
				} else {
					delete this.attributes[attribute.attrName];
				}
			}
		} else {
			attribute.remove(this.domNode);
			delete this.attributes[attribute.attrName];
		}
	}

	build() {
		this.attributes = {};
		const blot = Registry.find(this.domNode);
		if (blot == null) {
			return;
		}
		const attributes = Attributor.keys(this.domNode);
		const classes = ClassAttributor.keys(this.domNode);
		const styles = StyleAttributor.keys(this.domNode);
		attributes
			.concat(classes)
			.concat(styles)
			.forEach(name => {
				const attr = blot.scroll.query(name, Scope.ATTRIBUTE);
				if (attr instanceof Attributor) {
					this.attributes[attr.attrName] = attr;
				}
			});
	}

	copy(target) {
		Object.keys(this.attributes).forEach(key => {
			const value = this.attributes[key].value(this.domNode);
			target.format(key, value);
		});
	}

	move(target) {
		this.copy(target);
		Object.keys(this.attributes).forEach(key => {
			this.attributes[key].remove(this.domNode);
		});
		this.attributes = {};
	}

	values() {
		return Object.keys(this.attributes).reduce((attributes, name) => {
			attributes[name] = this.attributes[name].value(this.domNode);
			return attributes;
		}, {});
	}
}
