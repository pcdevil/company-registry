'use strict';

const { AbstractRoute } = require('../../abstract');
const { CategoriesDao } = require('../../../dao');

class	CategoriesIdPatchRoute extends AbstractRoute {
	constructor (categoriesDao) {
		const method = 'PATCH';
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
				const { name } = request.body;
				const document = await this._categoriesDao.update(id, name);
				const data = this._categoriesDao.documentListToObject([document]);
				return this._successResponse(data);
			} catch (e) {
				if (e.name === 'DocumentNotFoundError') {
					this._throwNotFoundError();
				} else {
					this._throwGenericError(e);
				}
			}
		};
	}

	_throwNotFoundError () {
		const error = new Error('the given id is not present in the collection');
		error.statusCode = 404;
		throw error;
	}
}

module.exports = { CategoriesIdPatchRoute };
