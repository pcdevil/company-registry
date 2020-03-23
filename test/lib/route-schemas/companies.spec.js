'use strict';

const { expect } = require('chai');
const { createCompaniesRouteSchema } = require('../../../src/lib');

describe('createCompaniesRouteSchema()', () => {
	it('should be well-defined', () => {
		const subject = createCompaniesRouteSchema();

		expect(subject.body).to.be.an('object');
		expect(subject.body.type).to.be.eql('object');
		expect(subject.body.properties).to.be.eql({
			categories: { type: 'array', items: { type: 'string' } },
			email: { type: 'string' },
			logoUrl: { type: 'string' },
			name: { type: 'string' },
		});
		expect(subject.body.required).to.be.eql([
			'logoUrl',
			'name',
		]);
	});
});
