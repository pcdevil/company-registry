'use strict';

const { NotImplementedError } = require('../lib');

class AbstractRoute {
	constructor (method, url) {
		this._method = method;
		this._url = url;
	}

	static createDefault () {
		return new this();
	}

	getOptions () {
		const method = this._method;
		const url = this._url;
		const handler = this._getHandler();
		return { method, url, handler };
	}

	_getHandler () {
		throw new NotImplementedError('getHandler');
	}
}

module.exports = { AbstractRoute };
