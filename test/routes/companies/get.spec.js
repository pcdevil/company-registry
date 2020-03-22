'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../../src/routes/abstract');
const { CompaniesGetRoute } = require('../../../src/routes');
const {
	AsyncFunction,
	createCompanyObjectStub,
} = require('../../_helpers');

describe('CompaniesGetRoute', () => {
	const id1 = '5e735ae25d27a6d4b2c6cd51id';
	const id2 = '5e7361b98e8f111a14b36377c3';
	let companiesDao;
	let company1;
	let company2;
	let companyList;
	let request;
	let reply;
	let subject;

	beforeEach(() => {
		company1 = createCompanyObjectStub(id1, { name: 'Test Company 1' });
		company2 = createCompanyObjectStub(id2, { name: 'Test Company 2' });
		companyList = [company1, company2];

		companiesDao = {
			list: sinon.stub().resolves(companyList),
		};
		request = {};
		reply = { code: sinon.stub() };
		subject = new CompaniesGetRoute(companiesDao);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractRoute);
	});

	describe('getOptions()', () => {
		it('should return the primitive properties as an object', () => {
			const actual = subject.getOptions();

			expect(actual.method).to.be.eql('GET');
			expect(actual.url).to.be.eql('/companies');
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

				expect(companiesDao.list).to.have.been.called;
				expect(actual).to.be.an('object');
				expect(actual.data).to.be.eql(companyList);
			});

			it('should catch dao errors and throw a generic one instead', async () => {
				const daoError = new Error('Error in the file /etc/passwd in line 14');
				companiesDao.list.rejects(daoError);
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
