'use strict';

const { AbstractRoute } = require('../abstract');

class RootGetRoute extends AbstractRoute {
	constructor () {
		super('GET', '/');
	}

	_getHandler () {
		return async () => ({ message: 'Hello, World' });
	}
}

module.exports = { RootGetRoute };
