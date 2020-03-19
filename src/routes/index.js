'use strict';

const CategoriesGetRouteExports = require('./categories/get.js');
const RootGetRouteExports = require('./root/get');

module.exports = {
	...CategoriesGetRouteExports,
	...RootGetRouteExports,
};
