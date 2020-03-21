'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractDao } = require('../../src/dao/abstract');
const { NotImplementedError } = require('../../src/lib');
const { AsyncFunction } = require('../async-function');
const { createAsyncStubCallFake } = require('../create-async-stub-call-fake');

describe('AbstractDao', () => {
	class TestDao extends AbstractDao {
		static getModelName () {
			return 'Test';
		}

		_getSchemaDescriptor () {
			return { value: { type: Number } };
		}
	}

	function createObjectId (id) {
		return { toString: () => id };
	}

	const testId = '5e735ae25d27a6d4b2c6cd51id';
	let Model;
	let modelStub;
	let mongooseModule;
	let testDocument;
	let testObject;
	let updatedTestDocument;
	let updatedTestObject;
	let findByIdReturn;
	let findByIdAndDeleteReturn;
	let findByIdAndUpdateReturn;
	let schema;
	let testSubject;

	beforeEach(() => {
		testObject = { _id: createObjectId(testId), value: 123 };
		testDocument = {
			_id: createObjectId(testId),
			value: 123,
			save: sinon.stub(),
			toObject: sinon.stub().returns(testObject),
		};
		updatedTestObject = { _id: createObjectId(testId), value: 456 };
		updatedTestDocument = {
			_id: createObjectId(testId),
			value: 456,
			save: sinon.stub(),
			toObject: sinon.stub().returns(updatedTestObject),
		};
		Model = sinon.stub().returns(testDocument);
		Model.find = sinon.stub().returns([testDocument]);
		findByIdReturn = { orFail: sinon.stub().returns(testDocument) };
		findByIdAndDeleteReturn = { orFail: sinon.stub().returns(testDocument) };
		findByIdAndUpdateReturn = { orFail: sinon.stub().returns(updatedTestDocument) };
		Model.findById = sinon.stub().returns(findByIdReturn);
		Model.findByIdAndDelete = sinon.stub().returns(findByIdAndDeleteReturn);
		Model.findByIdAndUpdate = sinon.stub().returns(findByIdAndUpdateReturn);
		schema = { obj: { value: { type: Number } } };
		modelStub = sinon.stub();
		modelStub.withArgs('Test').throws(new Error('MissingSchemaError'));
		modelStub.withArgs('Test', schema).returns(Model);
		mongooseModule = {
			Schema: sinon.stub().returns(schema),
			model: modelStub,
		};
		testSubject = new TestDao(mongooseModule);
	});

	describe('getModelName()', () => {
		it('should throw an error when the _getHandler method is not implemented', () => {
			expect(() => AbstractDao.getModelName()).to.throw(NotImplementedError);
		});
	});

	describe('getModel()', () => {
		it('should create the model from the module and return it', () => {
			const actual = testSubject.getModel();

			expect(mongooseModule.model).to.have.been.calledWith('Test', schema);
			expect(actual).to.be.equal(Model);
		});

		it('should not create the model when called the second time', () => {
			testSubject.getModel();
			mongooseModule.model.resetHistory();
			const actual = testSubject.getModel();

			expect(mongooseModule.model).to.not.have.been.called;
			expect(actual).to.be.equal(Model);
		});

		it('should get the model from the module and return it if another instance already defined that', () => {
			testSubject.getModel();
			mongooseModule.model.resetHistory();
			const newSubject = new TestDao(mongooseModule);

			const actual = newSubject.getModel();

			expect(mongooseModule.model).to.have.been.calledTwice;
			expect(mongooseModule.model.firstCall.args).to.be.eql(['Test']);
			expect(mongooseModule.model.secondCall.args).to.be.eql(['Test', schema]);
			expect(actual).to.be.equal(Model);
		});
	});

	describe('getSchema()', () => {
		it('should throw an error when the _getSchemaDescriptor method is not implemented', () => {
			const abstractSubject = new AbstractDao(mongooseModule);

			expect(() => abstractSubject.getSchema()).to.throw(NotImplementedError);
		});

		it('should create the schema from the module and return it', () => {
			const actual = testSubject.getSchema();

			expect(mongooseModule.Schema).to.have.been.calledWithNew;
			expect(mongooseModule.Schema).to.have.been.calledWith(schema.obj);
			expect(actual).to.be.equal(schema);
		});

		it('should not create the schema when called the second time', () => {
			testSubject.getSchema();
			mongooseModule.Schema.resetHistory();
			const actual = testSubject.getSchema();

			expect(mongooseModule.Schema).to.not.have.been.called;
			expect(actual).to.be.equal(schema);
		});
	});

	describe('list()', () => {
		it('should be an async function', () => {
			expect(testSubject.list).to.be.an.instanceof(AsyncFunction);
		});

		it('should search for the model properly', async () => {
			await testSubject.list();

			expect(Model.find).to.have.been.calledWith({});
			expect(testDocument.toObject).to.have.been.calledWith({ versionKey: false });
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			Model.find.callsFake(createAsyncStubCallFake(beforeStub, []));
			await testSubject.list();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the list of the existing documents as objects', async () => {
			const actual = await testSubject.list();

			expect(actual).to.be.eql([testObject]);
		});
	});

	describe('create()', () => {
		it('should be an async function', () => {
			expect(testSubject.create).to.be.an.instanceof(AsyncFunction);
		});

		it('should create a new model and call the save method properly', async () => {
			await testSubject.create({ value: 123 });

			expect(Model).to.have.been.calledWithNew;
			expect(Model).to.have.been.calledWith({ value: 123 });
			expect(testDocument.save).to.have.been.called;
			expect(testDocument.toObject).to.have.been.calledWith({ versionKey: false });
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			testDocument.save.callsFake(createAsyncStubCallFake(beforeStub));
			await testSubject.create({ value: 123 });
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the new document', async () => {
			const actual = await testSubject.create({ value: 123 });

			expect(actual).to.be.eql(testObject);
		});
	});

	describe('read()', () => {
		it('should be an async function', () => {
			expect(testSubject.read).to.be.an.instanceof(AsyncFunction);
		});

		it('should search for the model properly', async () => {
			await testSubject.read(testId);

			expect(Model.findById).to.have.been.calledWith(testId);
			expect(findByIdReturn.orFail).to.have.been.calledAfter(Model.findById);
			expect(testDocument.toObject).to.have.been.calledWith({ versionKey: false });
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			findByIdReturn.orFail.callsFake(createAsyncStubCallFake(beforeStub, testDocument));
			await testSubject.read(testId);
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the existing document', async () => {
			const actual = await testSubject.read(testId);

			expect(actual).to.be.eql(testObject);
		});
	});

	describe('update()', () => {
		it('should be an async function', () => {
			expect(testSubject.update).to.be.an.instanceof(AsyncFunction);
		});

		it('should update the model properly', async () => {
			await testSubject.update(testId, { value: 456 });

			expect(Model.findByIdAndUpdate).to.have.been.calledWith(testId, { value: 456 }, { new: true });
			expect(findByIdAndUpdateReturn.orFail).to.have.been.calledAfter(Model.findByIdAndUpdate);
			expect(updatedTestDocument.toObject).to.have.been.calledWith({ versionKey: false });
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			findByIdAndUpdateReturn.orFail.callsFake(createAsyncStubCallFake(beforeStub, updatedTestDocument));
			await testSubject.update(testId, { value: 456 });
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the updated document', async () => {
			const actual = await testSubject.update(testId, { value: 456 });

			expect(actual).to.be.eql(updatedTestObject);
		});
	});

	describe('delete()', () => {
		it('should be an async function', () => {
			expect(testSubject.delete).to.be.an.instanceof(AsyncFunction);
		});

		it('should delete from the model properly', async () => {
			await testSubject.delete(testId);

			expect(Model.findByIdAndDelete).to.have.been.calledWith(testId);
			expect(findByIdAndDeleteReturn.orFail).to.have.been.calledAfter(Model.findByIdAndDelete);
			expect(testDocument.toObject).to.have.been.calledWith({ versionKey: false });
		});

		it('should wait for the document to resolve', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			findByIdAndDeleteReturn.orFail.callsFake(createAsyncStubCallFake(beforeStub, testDocument));
			await testSubject.delete(testId);
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should return the deleted document', async () => {
			const actual = await testSubject.delete(testId);

			expect(actual).to.be.eql(testObject);
		});
	});
});
