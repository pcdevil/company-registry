'use strict';

const { expect } = require('chai');
const { createCategoriesRouteSchema } = require('../../../src/lib');

describe('createCategoriesRouteSchema()', () => {
	it('should be well-defined', () => {
		const subject = createCategoriesRouteSchema();

		expect(subject.body).to.be.an('object');
		expect(subject.body.type).to.be.eql('object');
		expect(subject.body.properties).to.be.eql({
			name: { type: 'string' },
		});
		expect(subject.body.required).to.be.eql([
			'name',
		]);
	});
});
