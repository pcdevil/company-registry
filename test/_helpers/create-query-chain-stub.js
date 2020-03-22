'use strict';

const sinon = require('sinon');

function createQueryChainStub (returnValue, chainMembers = ['orFail', 'populate']) {
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

module.exports = { createQueryChainStub };
