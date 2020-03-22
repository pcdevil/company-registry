'use strict';

function createCategoriesRouteSchema () {
	return {
		body: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
				},
			},
			required: [
				'name',
			],
		},
	};
}

module.exports = { createCategoriesRouteSchema };
