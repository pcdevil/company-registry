'use strict';

const mongoose = require('mongoose');
const { Config } = require('./config');
const {
	CategoriesDao,
	CompaniesDao,
} = require('../dao');

class Database {
	constructor (mongooseModule, config, daos) {
		this._mongooseModule = mongooseModule;
		this._config = config;
		this._daos = daos;
	}

	static createDefault () {
		const config = Config.createDefault();
		const daos = [
			CategoriesDao.createDefault(),
			CompaniesDao.createDefault(),
		];
		return new this(mongoose, config, daos);
	}

	init () {
		for (const dao of this._daos) {
			dao.getModel();
		}
	}

	async connect () {
		await this._mongooseModule.connect(this._config.mongodb.uri, this._getMongooseOptions());
	}

	async disconnect () {
		await this._mongooseModule.disconnect();
	}

	_getMongooseOptions () {
		return {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000,
		};
	}
}

module.exports = { Database };
