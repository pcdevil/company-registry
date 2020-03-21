'use strict';

const CategoriesDaoExports = require('./categories');
const CompaniesDaoDaoExports = require('./companies');

module.exports = {
	...CategoriesDaoExports,
	...CompaniesDaoDaoExports,
};
