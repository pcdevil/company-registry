'use strict';

const { expect } = require('chai');
const { nullishOperator } = require('../../src/lib');

describe('nullishOperator', () => {
	const truthyHeads = [1, true, '!'];
	const falsyHeads = [0, false, ''];
	const truthyOr = 'Hello, World';
	const falsyOr = new Error();

	for (const head of truthyHeads) {
		it(`should return the "head" argument when it is a truthy value "${head}"`, () => {
			const actual = nullishOperator(head, falsyOr);

			expect(actual).to.be.eql(head);
		});
	}

	for (const head of falsyHeads) {
		it(`should return the "head" argument even when it is a falsy "${head}"`, () => {
			const actual = nullishOperator(head, falsyOr);

			expect(actual).to.be.eql(head);
		});
	}

	it(`should return the "or" argument when the "head" argument is undefined`, () => {
		const actual = nullishOperator(undefined, truthyOr);

		expect(actual).to.be.eql(truthyOr);
	});
});
