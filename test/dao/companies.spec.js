'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractDao } = require('../../src/dao/abstract');
const { CompaniesDao } = require('../../src/dao');

describe('CompaniesDao', () => {
	let mongooseModule;
	let objectId;
	let schema;
	let subject;

	beforeEach(() => {
		objectId = { name: 'ObjectId' };
		schema = { obj: {
			name: { type: String, required: true, unique: true },
			logoUrl: { type: String, required: true },
			email: { type: String, required: false },
			categories: [{ ref: 'Categories', type: objectId }],
		} };
		mongooseModule = { Schema: sinon.stub().returns(schema) };
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
});
