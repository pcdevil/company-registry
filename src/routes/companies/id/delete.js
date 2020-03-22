'use strict';

const { AbstractRoute } = require('../../abstract');
const { CompaniesDao } = require('../../../dao');

class	CompaniesIdDeleteRoute extends AbstractRoute {
	constructor (companiesDao) {
		super();
		this._method = 'DELETE';
		this._url = '/companies/:id';
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
				const document = await this._companiesDao.delete(id);
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { CompaniesIdDeleteRoute };
