import Iterator from './Iterator';

export default class Op {
	static iterator(ops) {
		return new Iterator(ops);
	}

	static length(op) {
		if (typeof op.delete === 'number') {
			return op.delete;
		} else if (typeof op.retain === 'number') {
			return op.retain;
		} else {
			return typeof op.insert === 'string' ? op.insert.length : 1;
		}
	}
};
