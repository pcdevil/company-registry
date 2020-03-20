'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractRoute } = require('../../../src/routes/abstract');
const { CategoriesGetRoute } = require('../../../src/routes');
const { AsyncFunction } = require('../../async-function');

describe('CategoriesGetRoute', () => {
	const id1 = '5e735ae25d27a6d4b2c6cd51id';
	const id2 = '5e7361b98e8f111a14b36377c3';
	const name1 = 'Test 1 2 3';
	const name2 = 'Test 4 5 6';
	let categoriesDao;
	let document1;
	let document2;
	let documentList;
	let documentObject1;
	let documentObject2;
	let documentObjectList;
	let request;
	let reply;
	let subject;

	beforeEach(() => {
		document1 = { _id: { toString: () => id1 }, name: name1, save: sinon.stub() };
		document2 = { _id: { toString: () => id2 }, name: name2, save: sinon.stub() };
		documentList = [document1, document2];
		documentObject1 = { id: id1, name: name1 };
		documentObject2 = { id: id2, name: name2 };
		documentObjectList = [documentObject1, documentObject2];

		const documentToObjectStub = sinon.stub();
		documentToObjectStub.withArgs(document1).returns(documentObject1);
		documentToObjectStub.withArgs(document2).returns(documentObject2);

		categoriesDao = {
			list: sinon.stub().resolves(documentList),
			documentToObject: documentToObjectStub,
			documentListToObject: sinon.stub().returns(documentObjectList),
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
				expect(actual.data).to.be.eql(documentObjectList);
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
