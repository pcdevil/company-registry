'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../src/routes/abstract');
const { NotImplementedError } = require('../../src/lib');

describe('AbstractRoute', () => {
	it('should throw an error when the getMethod method is called without implementation', () => {
		expect(AbstractRoute.getMethod).to.throw(NotImplementedError);
	});

	it('should throw an error when the getUrl method is called without implementation', () => {
		expect(AbstractRoute.getUrl).to.throw(NotImplementedError);
	});

	it('should throw an error when the getHandler method is called without implementation', () => {
		expect(AbstractRoute.getHandler).to.throw(NotImplementedError);
	});

	it('should generate a route options object when the getOptions called and the properties are implemented', () => {
		class TestRoute extends AbstractRoute {}

		const handler = async () => ({ test: true });
		const getHandlerStub = sinon.stub(TestRoute, 'getHandler').returns(handler);
		const method = '';
		const getMethodStub = sinon.stub(TestRoute, 'getMethod').returns(method);
		const url = '';
		const getUrlStub = sinon.stub(TestRoute, 'getUrl').returns(url);

		const actual = TestRoute.getOptions();

		expect(getHandlerStub).to.have.been.called;
		expect(getMethodStub).to.have.been.called;
		expect(getUrlStub).to.have.been.called;
		expect(actual).to.be.eql({ handler, method, url });
	});
});
