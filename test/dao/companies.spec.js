'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractDao } = require('../../src/dao/abstract');
const { CompaniesDao } = require('../../src/dao');
const { AsyncFunction } = require('../async-function');

describe('CompaniesDao', () => {
	function createQueryChain (returnValue, chainMembers = ['orFail', 'populate']) {
		const query = sinon.stub();
		query.returns(query);
		let memberToReturn = query;

		for (const member of chainMembers) {
			query[member] = sinon.stub().returns(query);
			memberToReturn = query[member];
		}
		memberToReturn.returns(returnValue);

		return query;
	}

	function createObjectId (id) {
		return { toString: () => id };
	}

	const companyId = '5e767a0d70835715160a346c';
	const categoryId = '51c35e5ced18cb901d000001';
	let Model;
	let categoryObject;
	let categoryDocument;
	let companyObject;
	let companyDocument;
	let modelStub;
	let mongooseModule;
	let updatedCompanyObject;
	let updatedCompanyDocument;
	let objectId;
	let schema;
	let subject;

	beforeEach(() => {
		objectId = { name: 'ObjectId' };
		categoryObject = {
			_id: createObjectId(categoryId),
			name: 'Test Category',
		};
		categoryDocument = {
			_id: createObjectId(categoryId),
			name: 'Test Category',
			save: sinon.stub(),
			toObject: sinon.stub().returns(categoryObject),
		};
		companyObject = {
			_id: createObjectId(companyId),
			name: 'Test Company',
			logoUrl: 'https://placekitten.com/244/244',
			email: 'test@company.co.uk',
			categories: [],
		};
		companyDocument = {
			_id: createObjectId(companyId),
			name: 'Test Company',
			logoUrl: 'https://placekitten.com/244/244',
			email: 'test@company.co.uk',
			categories: [],
			save: sinon.stub(),
			toObject: sinon.stub().returns(companyObject),
		};
		updatedCompanyObject = {
			_id: createObjectId(companyId),
			name: 'Test Company',
			logoUrl: 'https://placekitten.com/244/244',
			email: 'test@company.co.uk',
			categories: [categoryObject],
		};
		updatedCompanyDocument = {
			_id: createObjectId(companyId),
			name: 'Test Company',
			logoUrl: 'https://placekitten.com/244/244',
			email: 'test@company.co.uk',
			categories: [categoryDocument],
			save: sinon.stub(),
			toObject: sinon.stub().returns(updatedCompanyObject),
		};
		schema = { obj: {
			name: { type: String, required: true, unique: true },
			logoUrl: { type: String, required: true },
			email: { type: String, required: false },
			categories: [{ ref: 'Categories', type: objectId }],
		} };
		Model = sinon.stub().returns(companyDocument);
		Model.findByIdAndUpdate = createQueryChain(updatedCompanyDocument);
		modelStub = sinon.stub().returns(Model);
		mongooseModule = {
			Schema: sinon.stub().returns(schema),
			model: modelStub,
		};
		mongooseModule.Schema.Types = { ObjectId: objectId };
		subject = new CompaniesDao(mongooseModule);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractDao);
	});

	describe('getModelName()', () => {
		it('should return the name of the model', () => {
			expect(CompaniesDao.getModelName()).to.be.eql('Companies');
		});
	});

	describe('getPopulateablePaths', () => {
		it('should return the categories property', () => {
			const actual = subject.getPopulateablePaths();

			expect(actual).to.be.eql('categories');
		});
	});

	describe('getSchema()', () => {
		it('should create the schema from the module and return it', () => {
			const actual = subject.getSchema();

			expect(mongooseModule.Schema).to.have.been.calledWithNew;
			expect(mongooseModule.Schema).to.have.been.calledWith(schema.obj);
			expect(actual).to.be.equal(schema);
		});
	});

	describe('addCategory()', () => {
		it('should be an async function', () => {
			expect(subject.addCategory).to.be.an.instanceof(AsyncFunction);
		});

		it('should update the model properly', async () => {
			const properties = { '$push': { 'categories': categoryId } };

			await subject.addCategory(companyId, categoryId);

			expect(Model.findByIdAndUpdate).to.have.been.calledWith(companyId, properties, { new: true });
			expect(Model.findByIdAndUpdate.orFail).to.have.been.calledAfter(Model.findByIdAndUpdate);
			expect(Model.findByIdAndUpdate.populate).to.have.been.calledAfter(Model.findByIdAndUpdate.orFail);
			expect(Model.findByIdAndUpdate.populate).to.have.been.calledWith('categories');
			expect(updatedCompanyDocument.toObject).to.have.been.calledWith({ versionKey: false });
		});

		it('should return the updated document', async () => {
			const actual = await subject.addCategory(companyId, categoryId);

			expect(actual).to.be.eql(updatedCompanyObject);
		});
	});

	describe('deleteCategory()', () => {
		it('should be an async function', () => {
			expect(subject.deleteCategory).to.be.an.instanceof(AsyncFunction);
		});

		it('should update the model properly', async () => {
			const properties = { '$pull': { 'categories': categoryId } };

			await subject.deleteCategory(companyId, categoryId);

			expect(Model.findByIdAndUpdate).to.have.been.calledWith(companyId, properties, { new: true });
			expect(Model.findByIdAndUpdate.orFail).to.have.been.calledAfter(Model.findByIdAndUpdate);
			expect(Model.findByIdAndUpdate.populate).to.have.been.calledAfter(Model.findByIdAndUpdate.orFail);
			expect(Model.findByIdAndUpdate.populate).to.have.been.calledWith('categories');
			expect(updatedCompanyDocument.toObject).to.have.been.calledWith({ versionKey: false });
		});

		it('should return the updated document', async () => {
			Model.findByIdAndUpdate = createQueryChain(companyDocument);

			const actual = await subject.deleteCategory(companyId, categoryId);

			expect(actual).to.be.eql(companyObject);
		});
	});
});
