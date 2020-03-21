'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { AbstractDao } = require('../../src/dao/abstract');
const { CategoriesDao } = require('../../src/dao');

describe('CategoriesDao', () => {
	let mongooseModule;
	let schema;
	let subject;

	beforeEach(() => {
		schema = { obj: {
			name: { type: String, required: true, unique: true },
		} };
		mongooseModule = { Schema: sinon.stub().returns(schema) };
		subject = new CategoriesDao(mongooseModule);
	});

	it('should be an extension of the abstract class', () => {
		expect(subject).to.be.an.instanceof(AbstractDao);
	});

	describe('getModelName()', () => {
		it('should return the name of the model', () => {
			expect(CategoriesDao.getModelName()).to.be.eql('Categories');
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
