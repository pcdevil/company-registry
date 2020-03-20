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

	_successResponse (data) {
		return { data, statusCode: 200 };
	}

	_errorResponse () {
		return { data: [], error: { code: 500 }, success: false };
	}

	_throwGenericError (originalError) {
		const error = new Error('Something went wrong');
		error.originalError = originalError;
		throw error;
	}
}

module.exports = { AbstractRoute };
