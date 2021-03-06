'use strict';

const { AbstractRoute } = require('../../../abstract');
const { CategoriesDao } = require('../../../../dao');
const { createCategoriesRouteSchema } = require('../../../../lib');

class ApiCategoriesIdPatchRoute extends AbstractRoute {
	constructor (categoriesDao) {
		super();
		this._method = 'PATCH';
		this._url = '/api/categories/:id';
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
				const { id } = request.params;
				const { name } = request.body;
				const document = await this._categoriesDao.update(id, { name });
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { ApiCategoriesIdPatchRoute };
