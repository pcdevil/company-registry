'use strict';

function createAsyncStubCallFake (stubCallback) {
	return async () => new Promise((resolve) => {
		setTimeout(() => {
			stubCallback();
			resolve();
		}, 1);
	});
}

module.exports = { createAsyncStubCallFake };
