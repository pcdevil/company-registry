'use strict';

const { expect } = require('chai');
const { NotImplementedError } = require('../../src/lib');

describe('NotImplementedError', () => {
	const property = 'myMethod';
	let subject;

	beforeEach(() => {
		subject = new NotImplementedError(property);
	});

	it('should be an extension of the built-in error class', () => {
		expect(subject).to.be.an.instanceof(Error);
	});

	it('should set the name properly', () => {
		expect(subject.name).to.be.eql('NotImplementedError');
	});

	it('should set the message properly', () => {
		expect(subject.message).to.be.eql(`${property} is not implemented`);
	});
});
