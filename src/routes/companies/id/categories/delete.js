'use strict';

const { AbstractRoute } = require('../../../abstract');
const { CompaniesDao } = require('../../../../dao');

class	CompaniesIdCategoriesDeleteRoute extends AbstractRoute {
	constructor (companiesDao) {
		super();
		this._method = 'DELETE';
		this._url = '/companies/:companyId/categories/:categoryId';
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
				const document = await this._companiesDao.deleteCategory(companyId, categoryId);
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { CompaniesIdCategoriesDeleteRoute };
