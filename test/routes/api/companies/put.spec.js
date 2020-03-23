'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../../../src/routes/abstract');
const { ApiCompaniesPutRoute } = require('../../../../src/routes');
const { createCompaniesRouteSchema } = require('../../../../src/lib');
const {
	AsyncFunction,
	createCompanyObjectStub,
} = require('../../../_helpers');

describe('ApiCompaniesPutRoute', () => {
	const id = '5e735ae25d27a6d4b2c6cd51id';
	let companiesDao;
	let company;
	let companyList;
	let request;
	let reply;
	let subject;

	beforeEach(() => {
		company = createCompanyObjectStub(id);
		companyList = [company];
		companiesDao = {
			create: sinon.stub().resolves(company),
		};
		request = { body: {
			categories: company.categories,
			email: company.email,
			logoUrl: company.logoUrl,
			name: company.name,
		} };
		reply = { code: sinon.stub() };
		subject = new ApiCompaniesPutRoute(companiesDao);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractRoute);
	});

	describe('getOptions()', () => {
		it('should return the primitive properties as an object', () => {
			const actual = subject.getOptions();

			expect(actual.method).to.be.eql('PUT');
			expect(actual.url).to.be.eql('/api/companies');
			expect(actual.schema).to.be.eql(createCompaniesRouteSchema());
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

				expect(companiesDao.create).to.have.been.calledWith({
					categories: company.categories,
					email: company.email,
					logoUrl: company.logoUrl,
					name: company.name,
				});
				expect(actual).to.be.an('object');
				expect(actual.data).to.be.eql(companyList);
			});

			it('should catch dao errors and throw a generic one instead', async () => {
				const daoError = new Error('Error in the file /etc/passwd in line 14.');
				companiesDao.create.rejects(daoError);
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
				companiesDao.create.rejects(daoError);
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
