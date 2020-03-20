'use strict';

const { NotImplementedError } = require('../lib');

class AbstractRoute {
	constructor (method, url, schema = {}) {
		this._method = method;
		this._url = url;
		this._schema = schema;
	}

	static createDefault () {
		return new this();
	}

	getOptions () {
		const method = this._method;
		const url = this._url;
		const schema = this._schema;
		const handler = this._getHandler();
		return { method, url, schema, handler };
	}

	_getHandler () {
		throw new NotImplementedError('getHandler');
	}
}

module.exports = { AbstractRoute };
