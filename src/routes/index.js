'use strict';

const CategoriesGetRouteExports = require('./categories/get.js');
const CategoriesPutRouteExports = require('./categories/put.js');
const RootGetRouteExports = require('./root/get');

module.exports = {
	...CategoriesGetRouteExports,
	...CategoriesPutRouteExports,
	...RootGetRouteExports,
};
