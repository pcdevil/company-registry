'use strict';

const { expect } = require('chai');
const { AbstractRoute } = require('../../../src/routes/abstract');
const { RootGetRoute } = require('../../../src/routes');
const { AsyncFunction } = require('../../async-function');

describe('RootGetRoute', () => {
	it('should be an extension of the abstract class', () => {
		expect(RootGetRoute.prototype).to.be.an.instanceof(AbstractRoute);
	});

	it('should return "GET" when the getMethod method is called', () => {
		const actual = RootGetRoute.getMethod();

		expect(actual).to.be.eql('GET');
	});

	it('should return "/" when the getUrl method is called', () => {
		const actual = RootGetRoute.getUrl();

		expect(actual).to.be.eql('/');
	});

	it('should return an async function when the getHandler method is called', () => {
		const actual = RootGetRoute.getHandler();

		expect(actual).to.be.an.instanceof(AsyncFunction);
	});

	it('should return an object when the handler function is called', async () => {
		const handler = RootGetRoute.getHandler();

		const actual = await handler();

		expect(actual).to.be.an('object');
		expect(actual.message).to.be.eql('Hello, World');
	});
});
