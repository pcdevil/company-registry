'use strict';

const { AbstractDao } = require('./abstract');

class CategoriesDao extends AbstractDao {
	static getModelName () {
		return 'Categories';
	}

	_getSchemaDescriptor () {
		return {
			name: { type: String, required: true, unique: true },
		};
	}
}

module.exports = { CategoriesDao };
