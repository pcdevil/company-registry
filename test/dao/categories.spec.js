'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { CategoriesDao } = require('../../src/dao');
const { AsyncFunction } = require('../async-function');
const { createAsyncStubCallFake } = require('../create-async-stub-call-fake');

describe('CategoriesDao', () => {
	const id = '5e7361b98e811a14b36377c3';
	const name1 = 'Test 1 2 3';
	const name2 = 'Test 4 5 6';
	let Model;
	let mongooseModule;
	let document1;
	let document2;
	let schema;
	let subject;

	beforeEach(() => {
		document1 = { _id: id, name: name1, save: sinon.stub() };
		document2 = { _id: id, name: name2, save: sinon.stub() };
		Model = sinon.stub().returns(document1);
		Model.findById = sinon.stub().returns(document1);
		Model.findByIdAndDelete = sinon.stub().returns(document1);
		Model.findByIdAndUpdate = sinon.stub().returns(document2);
		schema = { obj: { name: { type: String, required: true, unique: true } } };
		mongooseModule = {
			Schema: sinon.stub().returns(schema),
			model: sinon.stub().returns(Model),
		};
		subject = new CategoriesDao(mongooseModule);
	});

	describe('getModelName()', () => {
		it('should return the name of the model', () => {
			expect(CategoriesDao.getModelName()).to.be.eql('Categories');
		});
	});

	describe('getModel()', () => {
		it('should create the model from the module and return it', () => {
			const actual = subject.getModel();

			expect(mongooseModule.model).to.have.been.calledWith('Categories', schema);
			expect(actual).to.be.equal(Model);
		});

		it('should not create the model when called the second time', () => {
			subject.getModel();
			mongooseModule.model.resetHistory();
			const actual = subject.getModel();

			expect(mongooseModule.model).to.not.have.been.called;
			expect(actual).to.be.equal(Model);
		});
	});

	describe('getSchema()', () => {
		it('should create the schema from the module and return it', () => {
			const actual = subject.getSchema();

			expect(mongooseModule.Schema).to.have.been.calledWithNew;
			expect(mongooseModule.Schema).to.have.been.calledWith(schema.obj);
			expect(actual).to.be.equal(schema);
		});

		it('should not create the schema when called the second time', () => {
			subject.getSchema();
			mongooseModule.Schema.resetHistory();
			const actual = subject.getSchema();

			expect(mongooseModule.Schema).to.not.have.been.called;
			expect(actual).to.be.equal(schema);
		});
	});

	describe('create()', () => {
		it('should be an async function', () => {
			expect(subject.create).to.be.an.instanceof(AsyncFunction);
		});

		it('should create a new model and call the save method properly', async () => {
			await subject.create(name1);

			expect(Model).to.have.been.calledWithNew;
			expect(Model).to.have.been.calledWith({ name: name1 });
			expect(document1.save).to.have.been.called;
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			document1.save.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.create(name1);
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the new document', async () => {
			const actual = await subject.create(name1);

			expect(actual).to.be.equal(document1);
		});
	});

	describe('read()', () => {
		it('should be an async function', () => {
			expect(subject.read).to.be.an.instanceof(AsyncFunction);
		});

		it('should search for the model properly', async () => {
			await subject.read(id);

			expect(Model.findById).to.have.been.calledWith(id);
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			Model.findById.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.read(id);
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the existing document', async () => {
			const actual = await subject.read(id);

			expect(actual).to.be.equal(document1);
		});
	});

	describe('update()', () => {
		it('should be an async function', () => {
			expect(subject.update).to.be.an.instanceof(AsyncFunction);
		});

		it('should search for the model properly', async () => {
			await subject.update(id, name2);

			expect(Model.findByIdAndUpdate).to.have.been.calledWith(id, { name: name2 }, { new: true });
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			Model.findByIdAndUpdate.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.update(id, name2);
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the updated document', async () => {
			const actual = await subject.update(id, name2);

			expect(actual).to.be.equal(document2);
		});
	});

	describe('delete()', () => {
		it('should be an async function', () => {
			expect(subject.delete).to.be.an.instanceof(AsyncFunction);
		});

		it('should delete from the model properly', async () => {
			await subject.delete(id);

			expect(Model.findByIdAndDelete).to.have.been.calledWith(id);
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			Model.findByIdAndDelete.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.delete(id);
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the deleted document', async () => {
			const actual = await subject.delete(id);

			expect(actual).to.be.equal(document1);
		});
	});
});
