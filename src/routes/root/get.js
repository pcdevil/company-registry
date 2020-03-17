'use strict';

const { AbstractRoute } = require('../abstract');

class RootGetRoute extends AbstractRoute {
	static getMethod () {
		return 'GET';
	}

	static getUrl () {
		return '/';
	}

	static getHandler () {
		return async () => ({ message: 'Hello, World' });
	}
}

module.exports = { RootGetRoute };
