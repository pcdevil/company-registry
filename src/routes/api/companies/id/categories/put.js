'use strict';

const { AbstractRoute } = require('../../../../abstract');
const { CompaniesDao } = require('../../../../../dao');

class ApiCompaniesIdCategoriesPutRoute extends AbstractRoute {
	constructor (companiesDao) {
		super();
		this._method = 'PUT';
		this._url = '/api/companies/:companyId/categories/:categoryId';
		this._companiesDao = companiesDao;
	}

	static createDefault () {
		const companiesDao = CompaniesDao.createDefault();
		return new this(companiesDao);
	}

	_getHandler () {
		return async (request, reply) => {
			try {
				const { companyId, categoryId } = request.params;
				const document = await this._companiesDao.addCategory(companyId, categoryId);
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { ApiCompaniesIdCategoriesPutRoute };
