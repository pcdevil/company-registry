'use strict';

const createCategoriesRouteSchemaExports = require('./route-schemas/categories');
const NotImplementedErrorExports = require('./not-implemented-error');
const nullishOperatorExports = require('./nullish-operator');

module.exports = {
	...createCategoriesRouteSchemaExports,
	...NotImplementedErrorExports,
	...nullishOperatorExports,
};
