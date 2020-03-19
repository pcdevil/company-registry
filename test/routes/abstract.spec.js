'use strict';

const { expect } = require('chai');
const { AbstractRoute } = require('../../src/routes/abstract');
const { NotImplementedError } = require('../../src/lib');


describe('AbstractRoute', () => {
	const method = 'GET';
	const url = '/';
	const handler = async () => ({ test: true });

	describe('getOptions()', () => {
		it('should throw an error when the _getHandler method is not implemented', () => {
			const subject = new AbstractRoute(method, url);

			expect(() => subject.getOptions()).to.throw(NotImplementedError);
		});

		it('should return the properties as an object when the _getHandler is implemented', () => {
			class TestRoute extends AbstractRoute {
				_getHandler () {
					return handler;
				}
			}
			const subject = new TestRoute(method, url);

			const actual = subject.getOptions();

			expect(actual).to.be.eql({ method, url, handler });
		});
	});
});
