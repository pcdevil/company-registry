'use strict';

const { NotImplementedError } = require('../lib');

class AbstractRoute {
	static getMethod () {
		throw new NotImplementedError('getMethod');
	}

	static getUrl () {
		throw new NotImplementedError('getUrl');
	}

	static getHandler () {
		throw new NotImplementedError('getHandler');
	}

	static getOptions () {
		const method = this.getMethod();
		const url = this.getUrl();
		const handler = this.getHandler();

		return { method, url, handler };
	}
}

module.exports = { AbstractRoute };
