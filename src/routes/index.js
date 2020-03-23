'use strict';

const ApiCategoriesGetRouteExports = require('./api/categories/get.js');
const ApiCategoriesPutRouteExports = require('./api/categories/put.js');
const ApiCategoriesIdDeleteRouteExports = require('./api/categories/id/delete.js');
const ApiCategoriesIdGetRouteExports = require('./api/categories/id/get.js');
const ApiCategoriesIdPatchRouteExports = require('./api/categories/id/patch.js');
const ApiCompaniesGetRouteExports = require('./api/companies/get.js');
const ApiCompaniesPutRouteExports = require('./api/companies/put.js');
const ApiCompaniesIdCategoriesDeleteRouteExports = require('./api/companies/id/categories/delete.js');
const ApiCompaniesIdCategoriesPutRouteExports = require('./api/companies/id/categories/put.js');
const ApiCompaniesIdDeleteRouteExports = require('./api/companies/id/delete.js');
const ApiCompaniesIdGetRouteExports = require('./api/companies/id/get.js');
const ApiCompaniesIdPatchRouteExports = require('./api/companies/id/patch.js');
const RootGetRouteExports = require('./root/get');

module.exports = {
	...ApiCategoriesGetRouteExports,
	...ApiCategoriesPutRouteExports,
	...ApiCategoriesIdDeleteRouteExports,
	...ApiCategoriesIdGetRouteExports,
	...ApiCategoriesIdPatchRouteExports,
	...ApiCompaniesGetRouteExports,
	...ApiCompaniesPutRouteExports,
	...ApiCompaniesIdCategoriesDeleteRouteExports,
	...ApiCompaniesIdCategoriesPutRouteExports,
	...ApiCompaniesIdDeleteRouteExports,
	...ApiCompaniesIdGetRouteExports,
	...ApiCompaniesIdPatchRouteExports,
	...RootGetRouteExports,
};
