'use strict';

const { AbstractRoute } = require('../abstract');
const { CompaniesDao } = require('../../dao');

class CompaniesGetRoute extends AbstractRoute {
	constructor (companiesDao) {
		super();
		this._method = 'GET';
		this._url = '/companies';
		this._companiesDao = companiesDao;
	}

	static createDefault () {
		const companiesDao = CompaniesDao.createDefault();
		return new this(companiesDao);
	}

	_getHandler () {
		return async (request, reply) => {
			try {
				const documentList = await this._companiesDao.list();
				return this._successResponse(documentList);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { CompaniesGetRoute };
