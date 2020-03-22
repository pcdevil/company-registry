'use strict';

const dotenv = require('dotenv');
const { nullishOperator } = require('../lib');

class Config {
	constructor (dotenvModule, processModule) {
		this._dotenvModule = dotenvModule;
		this._processModule = processModule;

		this._dotenvModule.config();
	}

	static createDefault () {
		return new this(dotenv, process);
	}

	get mongodb () {
		return {
			uri: this._getEnvVariable('MONGODB_URI', 'mongodb://mongodb:27017/company-registry'),
		};
	}

	get server () {
		return {
			port: this._getEnvVariable('PORT', 8080),
			logger: this._getEnvVariable('LOGGER', true),
		};
	}

	_getEnvVariable (variableName, defaultValue) {
		return nullishOperator(this._processModule.env[variableName], defaultValue);
	}
}

module.exports = { Config };
