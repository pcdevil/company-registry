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
				const data = this._categoriesDao.documentListToObject([document]);

				return this._successResponse(data);
			} catch (e) {
				if (e.code === 11000) {
					this._throwDuplicateKeyError();
				} else {
					this._throwGenericError(e);
				}
			}
		};
	}

	_throwDuplicateKeyError () {
		const error = new Error(`the "name" property should be unique in the collection`);
		error.statusCode = 400;
		throw error;
	}
}

module.exports = { CategoriesPutRoute };
