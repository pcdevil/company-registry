'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../../src/routes/abstract');
const { CategoriesGetRoute } = require('../../../src/routes');
const {
	AsyncFunction,
	createCategoryObjectStub,
} = require('../../_helpers');

describe('CategoriesGetRoute', () => {
	const id1 = '5e735ae25d27a6d4b2c6cd51id';
	const id2 = '5e7361b98e8f111a14b36377c3';
	let categoriesDao;
	let category1;
	let category2;
	let categoryList;
	let request;
	let reply;
	let subject;

	beforeEach(() => {
		category1 = createCategoryObjectStub(id1, { name: 'Test Company 1' });
		category2 = createCategoryObjectStub(id2, { name: 'Test Company 2' });
		categoryList = [category1, category2];

		categoriesDao = {
			list: sinon.stub().resolves(categoryList),
		};
		request = {};
		reply = { code: sinon.stub() };
		subject = new CategoriesGetRoute(categoriesDao);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractRoute);
	});

	describe('getOptions()', () => {
		it('should return the primitive properties as an object', () => {
			const actual = subject.getOptions();

			expect(actual.method).to.be.eql('GET');
			expect(actual.url).to.be.eql('/categories');
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
				expect(actual.statusCode).to.be.eql(200);
			});

			it('should return the documents from the dao as simple objects', async () => {
				const { handler } = subject.getOptions();

				const actual = await handler(request, reply);

				expect(categoriesDao.list).to.have.been.called;
				expect(actual).to.be.an('object');
				expect(actual.data).to.be.eql(categoryList);
			});

			it('should catch dao errors and throw a generic one instead', async () => {
				const daoError = new Error('Error in the file /etc/passwd in line 14');
				categoriesDao.list.rejects(daoError);
				const { handler } = subject.getOptions();

				try {
					await handler(request, reply);
					throw new Error('fell through');
				} catch (e) {
					expect(e).to.be.instanceof(Error);
					expect(e.message).to.be.eql('Something went wrong');
					expect(e.originalError).to.be.equal(daoError);
				}
			});
		});
	});
});
