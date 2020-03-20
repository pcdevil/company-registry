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

	_throwError (e) {
		if (e.code === 11000) {
			this._throwDuplicateKeyError();
		}

		if (e.name === 'DocumentNotFoundError') {
			this._throwNotFoundError();
		}

		this._throwGenericError(e);
	}

	_throwGenericError (originalError) {
		const error = new Error('Something went wrong');
		error.originalError = originalError;
		throw error;
	}

	_throwDuplicateKeyError () {
		const error = new Error(`the "name" property should be unique in the collection`);
		error.statusCode = 400;
		throw error;
	}

	_throwNotFoundError () {
		const error = new Error('the given id is not present in the collection');
		error.statusCode = 404;
		throw error;
	}
}

module.exports = { AbstractRoute };
