'use strict';

class NotImplementedError extends Error {
	constructor (property) {
		super(`${property} is not implemented`);
		this.name = this.constructor.name;
	}
}

module.exports = { NotImplementedError };
