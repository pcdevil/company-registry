'use strict';

const { expect } = require('chai');
const { AbstractRoute } = require('../../../src/routes/abstract');
const { RootGetRoute } = require('../../../src/routes');
const { AsyncFunction } = require('../../_helpers');

describe('RootGetRoute', () => {
	let subject;

	beforeEach(() => {
		subject = new RootGetRoute();
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractRoute);
	});

	describe('getOptions()', () => {
		it('should return the properties as an object', () => {
			const actual = subject.getOptions();

			expect(actual.method).to.be.eql('GET');
			expect(actual.url).to.be.eql('/');
			expect(actual.handler).to.be.a('function');
		});

		it('should return an async function as the handler', () => {
			const { handler } = subject.getOptions();

			expect(handler).to.be.an.instanceof(AsyncFunction);
		});

		it('should return an object when the handler function is called', async () => {
			const { handler } = subject.getOptions();

			const actual = await handler();

			expect(actual).to.be.an('object');
			expect(actual.message).to.be.eql('Hello, World');
		});
	});
});
