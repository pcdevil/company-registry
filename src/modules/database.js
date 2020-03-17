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

	connect () {
		this._mongooseModule.connect(this._getMongooseUri(), this._getMongooseOptions());
	}

	disconnect () {
		this._mongooseModule.disconnect();
	}

	_getMongooseUri () {
		return `mongodb://${this._config.mongodb.host}:${this._config.mongodb.port}/${this._config.mongodb.database}`;
	}

	_getMongooseOptions () {
		return {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};
	}
}

module.exports = { Database };
