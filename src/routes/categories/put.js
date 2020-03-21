'use strict';

const { AbstractRoute } = require('../abstract');
const { CategoriesDao } = require('../../dao');

class CategoriesPutRoute extends AbstractRoute {
	constructor (categoriesDao) {
		const method = 'PUT';
		const url = '/categories';
		const schema = {
			body: {
				type: 'object',
				properties: {
					name: { type: 'string' },
				},
				required: ['name'],
			},
		};
		super(method, url, schema);
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
				const document = await this._categoriesDao.create(name);
				return this._successResponse([document]);
			} catch (e) {
				this._throwError(e);
			}
		};
	}
}

module.exports = { CategoriesPutRoute };
