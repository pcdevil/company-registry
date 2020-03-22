'use strict';

const CategoriesGetRouteExports = require('./categories/get.js');
const CategoriesPutRouteExports = require('./categories/put.js');
const CategoriesIdDeleteRouteExports = require('./categories/id/delete.js');
const CategoriesIdGetRouteExports = require('./categories/id/get.js');
const CategoriesIdPatchRouteExports = require('./categories/id/patch.js');
const CompaniesGetRouteExports = require('./companies/get.js');
const CompaniesPutRouteExports = require('./companies/put.js');
const CompaniesIdCategoriesDeleteRouteExports = require('./companies/id/categories/delete.js');
const CompaniesIdCategoriesPutRouteExports = require('./companies/id/categories/put.js');
const CompaniesIdDeleteRouteExports = require('./companies/id/delete.js');
const CompaniesIdGetRouteExports = require('./companies/id/get.js');
const CompaniesIdPatchRouteExports = require('./companies/id/patch.js');
const RootGetRouteExports = require('./root/get');

module.exports = {
	...CategoriesGetRouteExports,
	...CategoriesPutRouteExports,
	...CategoriesIdDeleteRouteExports,
	...CategoriesIdGetRouteExports,
	...CategoriesIdPatchRouteExports,
	...CompaniesGetRouteExports,
	...CompaniesPutRouteExports,
	...CompaniesIdCategoriesDeleteRouteExports,
	...CompaniesIdCategoriesPutRouteExports,
	...CompaniesIdDeleteRouteExports,
	...CompaniesIdGetRouteExports,
	...CompaniesIdPatchRouteExports,
	...RootGetRouteExports,
};
