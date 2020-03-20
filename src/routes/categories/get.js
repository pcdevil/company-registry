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
				const data = documentList
					.map((document) => this._categoriesDao.documentToObject(document));
				return this._successResponse(data);
			} catch (e) {
				this._throwGenericError(e);
			}
		};
	}

	_throwGenericError (originalError) {
		const error = new Error('Something went wrong');
		error.originalError = originalError;
		throw error;
	}
}

module.exports = { CategoriesGetRoute };
