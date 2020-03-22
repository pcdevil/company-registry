'use strict';

const { AbstractRoute } = require('../abstract');
const { CategoriesDao } = require('../../dao');
const { createCategoriesRouteSchema } = require('../../lib');

class CategoriesPutRoute extends AbstractRoute {
	constructor (categoriesDao) {
		super();
		this._method = 'PUT';
		this._url = '/categories';
		this._schema = createCategoriesRouteSchema();
		this._categoriesDao = categoriesDao;
	}

	static createDefault () {
		const categoriesDao = CategoriesDao.createDefault();
		return new this(categoriesDao);
	}

	_getHandler () {
		return async (request, reply) => {
			try {
				const { name } = request.body;
				const document = await this._categoriesDao.create({ name });
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { CategoriesPutRoute };
