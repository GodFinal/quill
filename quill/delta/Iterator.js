import Op from './Op';
export default class Iterator {
	constructor(ops) {
		this.ops = ops;
		this.index = 0;
		this.offset = 0;
	}

	hasNext() {
		return this.peekLength() < Infinity;
	}

	next(length) {
		if (!length) {
			length = Infinity;
		}
		const nextOp = this.ops[this.index];
		if (nextOp) {
			const offset = this.offset;
			const opLength = Op.length(nextOp);
			if (length >= opLength - offset) {
				length = opLength - offset;
				this.index += 1;
				this.offset = 0;
			}
			else {
				this.offset += length;
			}
			if (typeof nextOp.delete === 'number') {
				return {delete: length};
			}
			else {
				const retOp = {};
				if (nextOp.attributes) {
					retOp.attributes = nextOp.attributes;
				}
				if (typeof nextOp.retain === 'number') {
					retOp.retain = length;
				}
				else if (typeof nextOp.insert === 'string') {
					retOp.insert = nextOp.insert.substr(offset, length);
				}
				else {
					// offset should === 0, length should === 1
					retOp.insert = nextOp.insert;
				}
				return retOp;
			}
		}
		else {
			return {retain: Infinity};
		}
	}

	peek() {
		return this.ops[this.index];
	}

	peekLength() {
		if (this.ops[this.index]) {
			// Should never return 0 if our index is being managed correctly
			return Op.length(this.ops[this.index]) - this.offset;
		}
		else {
			return Infinity;
		}
	}

	peekType() {
		if (this.ops[this.index]) {
			if (typeof this.ops[this.index].delete === 'number') {
				return 'delete';
			}
			else if (typeof this.ops[this.index].retain === 'number') {
				return 'retain';
			}
			else {
				return 'insert';
			}
		}
		return 'retain';
	}

	rest() {
		if (!this.hasNext()) {
			return [];
		}
		else if (this.offset === 0) {
			return this.ops.slice(this.index);
		}
		else {
			const offset = this.offset;
			const index = this.index;
			const next = this.next();
			const rest = this.ops.slice(this.index);
			this.offset = offset;
			this.index = index;
			return [next].concat(rest);
		}
	}
}
