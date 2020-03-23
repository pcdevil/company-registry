'use strict';

const { AbstractRoute } = require('../../../abstract');
const { CompaniesDao } = require('../../../../dao');
const { createCompaniesRouteSchema } = require('../../../../lib');

class ApiCompaniesIdPatchRoute extends AbstractRoute {
	constructor (companiesDao) {
		super();
		this._method = 'PATCH';
		this._url = '/api/companies/:id';
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
				const { id } = request.params;
				const { categories, email, logoUrl, name } = request.body;
				const document = await this._companiesDao.update(id, { categories, email, logoUrl, name });
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { ApiCompaniesIdPatchRoute };
