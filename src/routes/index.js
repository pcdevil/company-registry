'use strict';

const CategoriesGetRouteExports = require('./categories/get.js');
const CategoriesPutRouteExports = require('./categories/put.js');
const CategoriesIdDeleteRouteExports = require('./categories/id/delete.js');
const CategoriesIdGetRouteExports = require('./categories/id/get.js');
const CategoriesIdPatchRouteExports = require('./categories/id/patch.js');
const RootGetRouteExports = require('./root/get');

module.exports = {
	...CategoriesGetRouteExports,
	...CategoriesPutRouteExports,
	...CategoriesIdDeleteRouteExports,
	...CategoriesIdGetRouteExports,
	...CategoriesIdPatchRouteExports,
	...RootGetRouteExports,
};
