'use strict';

const { AbstractRoute } = require('../abstract');
const { CategoriesDao } = require('../../dao');

class CategoriesGetRoute extends AbstractRoute {
	constructor (categoriesDao) {
		super('GET', '/categories');
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
				reply.code(500);
				return this._errorResponse();
			}
		};
	}

	_successResponse (data) {
		return { data, success: true };
	}

	_errorResponse () {
		return { data: [], error: { code: 500 }, success: false };
	}
}

module.exports = { CategoriesGetRoute };
