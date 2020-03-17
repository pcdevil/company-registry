'use strict';

const mongoose = require('mongoose');
const { Config } = require('./config');

class Database {
	constructor (mongooseModule, config) {
		this._mongooseModule = mongooseModule;
		this._config = config;
	}

	static createDefault () {
		const config = Config.createDefault();
		return new this(mongoose, config);
	}

	async connect () {
		await this._mongooseModule.connect(this._getMongooseUri(), this._getMongooseOptions());
	}

	async disconnect () {
		await this._mongooseModule.disconnect();
	}

	_getMongooseUri () {
		return `mongodb://${this._config.mongodb.host}:${this._config.mongodb.port}/${this._config.mongodb.database}`;
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
