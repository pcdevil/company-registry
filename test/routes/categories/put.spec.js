'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../../src/routes/abstract');
const { CategoriesPutRoute } = require('../../../src/routes');
const { AsyncFunction } = require('../../async-function');

describe('CategoriesPutRoute', () => {
	const id1 = '5e735ae25d27a6d4b2c6cd51id';
	const name1 = 'Test 1 2 3';
	let categoriesDao;
	let document1;
	let documentObject1;
	let documentObjectList;
	let request;
	let reply;
	let subject;

	beforeEach(() => {
		document1 = { _id: { toString: () => id1 }, name: name1, save: sinon.stub() };
		documentObject1 = { id: id1, name: name1 };
		documentObjectList = [documentObject1];
		categoriesDao = {
			create: sinon.stub().resolves(document1),
			documentToObject: sinon.stub().returns(documentObject1),
		};
		request = { body: { name: name1 } };
		reply = { code: sinon.stub() };
		subject = new CategoriesPutRoute(categoriesDao);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractRoute);
	});

	describe('getOptions()', () => {
		it('should return the primitive properties as an object', () => {
			const actual = subject.getOptions();

			expect(actual.method).to.be.eql('PUT');
			expect(actual.url).to.be.eql('/categories');
			expect(actual.schema).to.be.eql({ body: {
				type: 'object',
				properties: { name: { type: 'string' } },
				required: ['name'],
			} });
			expect(actual.handler).to.be.a('function');
		});

		it('should return an async function as the handler', () => {
			const { handler } = subject.getOptions();

			expect(handler).to.be.an.instanceof(AsyncFunction);
		});

		describe('handler()', () => {
			it('should return a well-formed response', async () => {
				const { handler } = subject.getOptions();

				const actual = await handler(request, reply);

				expect(actual).to.be.an('object');
				expect(actual.data).to.be.an('array');
				expect(actual.success).to.be.true;
			});

			it('should return the new document from the dao as simple object', async () => {
				const { handler } = subject.getOptions();

				const actual = await handler(request, reply);

				expect(categoriesDao.create).to.have.been.calledWith(name1);
				expect(actual).to.be.an('object');
				expect(actual.data).to.be.eql(documentObjectList);
			});

			it('should return a well-formed response when the dao throws an error', async () => {
				categoriesDao.create.rejects(new Error());
				const { handler } = subject.getOptions();

				const actual = await handler(request, reply);

				expect(reply.code).to.have.been.calledWith(500);

				expect(actual).to.be.an('object');
				expect(actual.data).to.be.an('array');
				expect(actual.data).to.be.empty;
				expect(actual.error).to.be.an('object');
				expect(actual.error.code).to.be.eql(500);
				expect(actual.success).to.be.false;
			});
		});
	});
});
