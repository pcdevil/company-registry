'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../../../../../src/routes/abstract');
const { ApiCompaniesIdCategoriesDeleteRoute } = require('../../../../../../src/routes');
const {
	AsyncFunction,
	createCompanyObjectStub,
} = require('../../../../../_helpers');

describe('ApiCompaniesIdCategoriesDeleteRoute', () => {
	const companyId = '5e735ae25d27a6d4b2c6cd51id';
	const categoryId = '5e7361b98e8f111a14b36377c3';
	let companiesDao;
	let company;
	let companyList;
	let request;
	let reply;
	let subject;

	beforeEach(() => {
		company = createCompanyObjectStub(companyId);
		companyList = [company];

		companiesDao = {
			deleteCategory: sinon.stub().resolves(company),
		};
		request = { params: { companyId, categoryId } };
		reply = { code: sinon.stub() };
		subject = new ApiCompaniesIdCategoriesDeleteRoute(companiesDao);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractRoute);
	});

	describe('getOptions()', () => {
		it('should return the primitive properties as an object', () => {
			const actual = subject.getOptions();

			expect(actual.method).to.be.eql('DELETE');
			expect(actual.url).to.be.eql('/api/companies/:companyId/categories/:categoryId');
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

			it('should return the deleted document from the dao as simple object', async () => {
				const { handler } = subject.getOptions();

				const actual = await handler(request, reply);

				expect(companiesDao.deleteCategory).to.have.been.calledWith(companyId, categoryId);
				expect(actual).to.be.an('object');
				expect(actual.data).to.be.eql(companyList);
			});

			it('should transform and throw the not found error from the dao', async () => {
				const error = new Error();
				error.name = 'DocumentNotFoundError';
				companiesDao.deleteCategory.throws(error);
				const { handler } = subject.getOptions();

				try {
					await handler(request, reply);
					throw new Error('fell through');
				} catch (e) {
					expect(e).to.be.instanceof(Error);
					expect(e.statusCode).to.be.eql(404);
					expect(e.message).to.be.eql('the given id is not present in the collection');
				}
			});

			it('should catch dao errors and throw a generic one instead', async () => {
				const daoError = new Error('Error in the file /etc/passwd in line 14');
				companiesDao.deleteCategory.rejects(daoError);
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
