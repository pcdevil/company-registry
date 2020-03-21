'use strict';

const { AbstractRoute } = require('../../abstract');
const { CategoriesDao } = require('../../../dao');

class	CategoriesIdGetRoute extends AbstractRoute {
	constructor (categoriesDao) {
		super();
		this._method = 'GET';
		this._url = '/categories/:id';
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
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { CategoriesIdGetRoute };
