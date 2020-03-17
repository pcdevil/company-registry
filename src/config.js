'use strict';

const dotenv = require('dotenv');
const { nullishOperator } = require('./lib');

class Config {
	constructor (dotenvModule) {
		this._dotenvModule = dotenvModule;

		const config = this._dotenvModule.config();

		this._parsedConfig = config.error ? {} : config.parsed;
	}

	static createDefault () {
		return new this(dotenv);
	}

	get server () {
		return {
			host: nullishOperator(this._parsedConfig.SERVER_HOST, 'localhost'),
			port: nullishOperator(this._parsedConfig.SERVER_PORT, 8080),
			logger: nullishOperator(this._parsedConfig.SERVER_LOGGER, true),
		};
	}
}

module.exports = { Config };
