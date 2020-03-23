'use strict';

const { AbstractRoute } = require('../../abstract');
const { CategoriesDao } = require('../../../dao');

class ApiCategoriesGetRoute extends AbstractRoute {
	constructor (categoriesDao) {
		super();
		this._method = 'GET';
		this._url = '/api/categories';
		this._categoriesDao = categoriesDao;
	}

	static createDefault () {
		const categoriesDao = CategoriesDao.createDefault();
		return new this(categoriesDao);
	}

	_getHandler () {
		return async (request, reply) => {
			try {
				const documentList = await this._categoriesDao.list();
				return this._successResponse(documentList);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { ApiCategoriesGetRoute };
