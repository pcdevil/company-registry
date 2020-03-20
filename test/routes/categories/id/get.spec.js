'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../../../src/routes/abstract');
const { CategoriesIdGetRoute } = require('../../../../src/routes');
const { AsyncFunction } = require('../../../async-function');

describe('CategoriesIdGetRoute', () => {
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
			read: sinon.stub().resolves(document1),
			documentToObject: sinon.stub().returns(documentObject1),
			documentListToObject: sinon.stub().returns(documentObjectList),
		};
		request = { params: { id: id1 } };
		reply = { code: sinon.stub() };
		subject = new CategoriesIdGetRoute(categoriesDao);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractRoute);
	});

	describe('getOptions()', () => {
		it('should return the primitive properties as an object', () => {
			const actual = subject.getOptions();

			expect(actual.method).to.be.eql('GET');
			expect(actual.url).to.be.eql('/categories/:id');
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


			it('should return the existing document from the dao as simple object', async () => {
				const { handler } = subject.getOptions();

				const actual = await handler(request, reply);

				expect(categoriesDao.read).to.have.been.calledWith(id1);
				expect(actual).to.be.an('object');
				expect(actual.data).to.be.eql(documentObjectList);
			});

			it('should transform and throw the not found error from the dao', async () => {
				const error = new Error();
				error.name = 'DocumentNotFoundError';
				categoriesDao.read.throws(error);
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
				categoriesDao.read.rejects(daoError);
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
