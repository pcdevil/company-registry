'use strict';

const { AbstractRoute } = require('../abstract');
const { CategoriesDao } = require('../../dao');

class CategoriesGetRoute extends AbstractRoute {
	constructor (categoriesDao) {
		const method = 'GET';
		const url = '/categories';
		super(method, url);
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
				const data = this._categoriesDao.documentListToObject(documentList);
				return this._successResponse(data);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { CategoriesGetRoute };
