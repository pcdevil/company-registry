'use strict';

const { expect } = require('chai');
const { AbstractRoute } = require('../../src/routes/abstract');
const { NotImplementedError } = require('../../src/lib');


describe('AbstractRoute', () => {
	class TestRoute extends AbstractRoute {
		_getHandler () {
			return handler;
		}
	}

	const method = 'GET';
	const url = '/';
	const schema = {
		body: {
			type: 'object',
			properties: { name: { type: 'string' } },
		},
	};
	const handler = async () => ({ test: true });

	describe('getOptions()', () => {
		it('should throw an error when the _getHandler method is not implemented', () => {
			const subject = new AbstractRoute(method, url, schema);

			expect(() => subject.getOptions()).to.throw(NotImplementedError);
		});

		it('should return the properties as an object', () => {
			const subject = new TestRoute(method, url, schema);

			const actual = subject.getOptions();

			expect(actual).to.be.eql({ method, url, schema, handler });
		});

		it('should return an empty schema if it was not defined', () => {
			const subject = new TestRoute(method, url);

			const actual = subject.getOptions();

			expect(actual.schema).to.be.eql({});
		});
	});
});
