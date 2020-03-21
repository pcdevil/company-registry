'use strict';

const { expect } = require('chai');
const { AbstractRoute } = require('../../src/routes/abstract');
const { NotImplementedError } = require('../../src/lib');


describe('AbstractRoute', () => {
	let subject;

	beforeEach(() => {
		subject = new AbstractRoute();
	});

	describe('getMethod()', () => {
		it('should return the default value', () => {
			const actual = subject.getMethod();

			expect(actual).to.be.eql('');
		});
	});

	describe('getUrl()', () => {
		it('should return the default value', () => {
			const actual = subject.getUrl();

			expect(actual).to.be.eql('');
		});
	});

	describe('getSchema()', () => {
		it('should return the default value', () => {
			const actual = subject.getSchema();

			expect(actual).to.be.eql({});
		});
	});

	describe('getOptions()', () => {
		it('should throw an error when the _getHandler method is not implemented', () => {
			expect(() => subject.getOptions()).to.throw(NotImplementedError);
		});

		it('should return the properties as an object', () => {
			const method = 'GET';
			const url = '/';
			const schema = { test: true };
			const handler = async () => ({ test: true });

			class TestRoute extends AbstractRoute {
				constructor () {
					super();
					this._method = method;
					this._url = url;
					this._schema = schema;
				}

				_getHandler () {
					return handler;
				}
			}

			const testSubject = new TestRoute();
			const actual = testSubject.getOptions();

			expect(actual).to.be.eql({ method, url, schema, handler });
		});
	});
});
