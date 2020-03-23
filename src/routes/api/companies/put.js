'use strict';

const { AbstractRoute } = require('../../abstract');
const { CompaniesDao } = require('../../../dao');
const { createCompaniesRouteSchema } = require('../../../lib');

class ApiCompaniesPutRoute extends AbstractRoute {
	constructor (companiesDao) {
		super();
		this._method = 'PUT';
		this._url = '/api/companies';
		this._schema = createCompaniesRouteSchema();
		this._companiesDao = companiesDao;
	}

	static createDefault () {
		const companiesDao = CompaniesDao.createDefault();
		return new this(companiesDao);
	}

	_getHandler () {
		return async (request, reply) => {
			try {
				const { categories, email, logoUrl, name } = request.body;
				const document = await this._companiesDao.create({ categories, email, logoUrl, name });
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { ApiCompaniesPutRoute };
