'use strict';

const { AbstractDao } = require('./abstract');
const { CategoriesDao } = require('./categories');

class CompaniesDao extends AbstractDao {
	static getModelName () {
		return 'Companies';
	}

	getPopulateablePaths () {
		return [
			'categories',
		].join(' ');
	}

	async addCategory (companyId, categoryId) {
		const properties = { '$push': { 'categories': categoryId } };
		return this.update(companyId, properties);
	}

	async deleteCategory (companyId, categoryId) {
		const properties = { '$pull': { 'categories': categoryId } };
		return this.update(companyId, properties);
	}

	_getSchemaDescriptor () {
		return {
			name: { type: String, required: true, unique: true },
			logoUrl: { type: String, required: true },
			email: { type: String, required: false },
			categories: [{
				type: this._mongooseModule.Schema.Types.ObjectId,
				ref: CategoriesDao.getModelName(),
			}],
		};
	}
}

module.exports = { CompaniesDao };
