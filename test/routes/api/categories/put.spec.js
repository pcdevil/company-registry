'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../../../src/routes/abstract');
const { ApiCategoriesPutRoute } = require('../../../../src/routes');
const { createCategoriesRouteSchema } = require('../../../../src/lib');
const {
	AsyncFunction,
	createCategoryObjectStub,
} = require('../../../_helpers');

describe('ApiCategoriesPutRoute', () => {
	const id = '5e735ae25d27a6d4b2c6cd51id';
	let categoriesDao;
	let category;
	let categoryList;
	let request;
	let reply;
	let subject;

	beforeEach(() => {
		category = createCategoryObjectStub(id);
		categoryList = [category];
		categoriesDao = {
			create: sinon.stub().resolves(category),
		};
		request = { body: { name: category.name } };
		reply = { code: sinon.stub() };
		subject = new ApiCategoriesPutRoute(categoriesDao);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractRoute);
	});

	describe('getOptions()', () => {
		it('should return the primitive properties as an object', () => {
			const actual = subject.getOptions();

			expect(actual.method).to.be.eql('PUT');
			expect(actual.url).to.be.eql('/api/categories');
			expect(actual.schema).to.be.eql(createCategoriesRouteSchema());
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

			it('should return the new document from the dao as simple object', async () => {
				const { handler } = subject.getOptions();

				const actual = await handler(request, reply);

				expect(categoriesDao.create).to.have.been.calledWith({ name: category.name });
				expect(actual).to.be.an('object');
				expect(actual.data).to.be.eql(categoryList);
			});

			it('should catch dao errors and throw a generic one instead', async () => {
				const daoError = new Error('Error in the file /etc/passwd in line 14.');
				categoriesDao.create.rejects(daoError);
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

			it('should transform and throw the duplicate key error from the dao', async () => {
				const daoError = new Error('E11000 duplicate key error collection');
				daoError.code = 11000;
				categoriesDao.create.rejects(daoError);
				const { handler } = subject.getOptions();

				try {
					await handler(request, reply);
					throw new Error('fell through');
				} catch (e) {
					expect(e).to.be.instanceof(Error);
					expect(e.statusCode).to.be.eql(400);
					expect(e.message).to.be.eql(`the "name" property should be unique in the collection`);
				}
			});
		});
	});
});
