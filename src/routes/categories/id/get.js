'use strict';

const { AbstractRoute } = require('../../abstract');
const { CategoriesDao } = require('../../../dao');

class	CategoriesIdGetRoute extends AbstractRoute {
	constructor (categoriesDao) {
		const method = 'GET';
		const url = '/categories/:id';
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
				const { id } = request.params;
				const document = await this._categoriesDao.read(id);
				const data = this._categoriesDao.documentListToObject([document]);
				return this._successResponse(data);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { CategoriesIdGetRoute };
