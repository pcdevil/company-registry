'use strict';

const { AbstractRoute } = require('../abstract');
const { CategoriesDao } = require('../../dao');

class CategoriesGetRoute extends AbstractRoute {
	constructor (categoriesDao) {
		super();
		this._method = 'GET';
		this._url = '/categories';
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

module.exports = { CategoriesGetRoute };
