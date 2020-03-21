'use strict';

const { AbstractRoute } = require('../abstract');

class RootGetRoute extends AbstractRoute {
	constructor () {
		super();
		this._method = 'GET';
		this._url = '/';
	}

	_getHandler () {
		return async () => ({ message: 'Hello, World' });
	}
}

module.exports = { RootGetRoute };
