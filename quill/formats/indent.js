import {ClassAttributor, Scope, StyleAttributor} from '../parchment';

class IndentAttributor extends ClassAttributor {
	add(node, value) {
		if (value === '+1' || value === '-1') {
			const indent = this.value(node) || 0;
			value = value === '+1' ? indent + 1 : indent - 1;
		}
		if (value === 0) {
			this.remove(node);
			return true;
		}
		return super.add(node, value);
	}

	canAdd(node, value) {
		return super.canAdd(node, value) || super.canAdd(node, parseInt(value, 10));
	}

	value(node) {
		return parseInt(super.value(node), 10) || undefined; // Don't return NaN
	}
}

const IndentClass = new IndentAttributor('indent', 'ql-indent', {
	scope: Scope.BLOCK,
	whitelist: [1, 2, 3, 4, 5, 6, 7, 8]
});

class IndentStyleAttributor extends StyleAttributor {
	add(node, value) {
		if (value === '+1' || value === '-1') {
			const indent = this.value(node) || 0;
			value = value === '+1' ? indent + 40 : indent - 40;
		} else {
			switch (value % 10) {
				case 0:
					break;
				case 1:
					value += 39;
					break;
				case 9:
					value -= 39;
					break;
			}
		}
		if (value === 0) {
			this.remove(node);
			return true;
		}
		return super.add(node, `${value}px`);
	}

	canAdd(node, value) {
		return super.canAdd(node, value);
	}

	value(node) {
		return parseInt(super.value(node), 10) || undefined; // Don't return NaN
	}
}

const IndentStyle = new IndentStyleAttributor('indent', 'margin-left', {
	scope: Scope.BLOCK,
	whitelist: ['40px', '80px', '120px', '160px', '200px', '240px', '280px', '320px']
});

export {IndentStyle, IndentClass};
