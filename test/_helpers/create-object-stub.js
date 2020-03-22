'use strict';

const sinon = require('sinon');

function createCategoryObjectStub (categoryId, extraProperties = {}) {
	return createObjectStub(categoryId, { name: 'Test Category', ...extraProperties });
}

function createCategoryDocumentStub (categoryId, categoryObject, extraProperties) {
	return {
		...createDocumentMethodsStub(categoryObject),
		...createCategoryObjectStub(categoryId, extraProperties),
	};
}

function createCompanyObjectStub (companyId, extraProperties = {}) {
	return createObjectStub(companyId, {
		name: 'Test Company',
		logoUrl: 'https://placekitten.com/244/244',
		email: 'test@company.co.uk',
		categories: [],
		...extraProperties,
	});
}

function createCompanyDocumentStub (companyId, companyObject, extraProperties) {
	return {
		...createDocumentMethodsStub(companyObject),
		...createCompanyObjectStub(companyId, extraProperties),
	};
}

function createDocumentMethodsStub (toObjectReturnValue) {
	return {
		save: sinon.stub(),
		toObject: sinon.stub().returns(toObjectReturnValue),
	};
}

function createObjectIdStub (id) {
	return { toString: () => id };
}

function createObjectStub (id, properties) {
	return {
		_id: createObjectIdStub(id),
		...properties,
	};
}

module.exports = {
	createCategoryObjectStub,
	createCategoryDocumentStub,
	createCompanyObjectStub,
	createCompanyDocumentStub,
	createDocumentMethodsStub,
	createObjectStub,
};
