'use strict';

function createAsyncStubCallFake (stubCallback, resolveValue) {
	return async () => new Promise((resolve) => {
		setTimeout(() => {
			stubCallback();
			resolve(resolveValue);
		}, 1);
	});
}

module.exports = { createAsyncStubCallFake };
