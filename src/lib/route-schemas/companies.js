'use strict';

function createCompaniesRouteSchema () {
	return {
		body: {
			type: 'object',
			properties: {
				categories: { type: 'array', items: { type: 'string' } },
				email: { type: 'string' },
				logoUrl: { type: 'string' },
				name: { type: 'string' },
			},
			required: [
				'logoUrl',
				'name',
			],
		},
	};
}

module.exports = { createCompaniesRouteSchema };
