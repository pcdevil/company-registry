'use strict';

const fastify = require('fastify');
const { Config } = require('./config');

class Server {
	constructor (processModule, fastifyModule, config) {
		this._processModule = processModule;
		this._fastifyModule = fastifyModule;
		this._config = config;
	}

	static createDefault () {
		const config = Config.createDefault();
		return new this(process, fastify, config);
	}

	init () {
		const fastifyOptions = {
			logger: this._config.server.logger,
		};
		this._fastifyInstance = this._fastifyModule(fastifyOptions);

		this._initRoutes();
	}

	run () {
		try {
			this._fastifyInstance.listen(this._config.server.port);
		} catch (err) {
			this._fastifyInstance.log.error(err);
			this._processModule.exit(1);
		}
	}

	_initRoutes () {
		this._fastifyInstance.get('/', this.rootRouteHandler);
	}

	async rootRouteHandler () {
		return { message: 'Hello, World' };
	}
}

module.exports = { Server };
