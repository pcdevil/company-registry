'use strict';

const fastify = require('fastify');
const { Config } = require('./config');
const { RootGetRoute } = require('./routes');

class Server {
	constructor (processModule, fastifyModule, config, routes) {
		this._processModule = processModule;
		this._fastifyModule = fastifyModule;
		this._config = config;
		this._routes = routes;
	}

	static createDefault () {
		const config = Config.createDefault();
		const routes = [
			RootGetRoute,
		];
		return new this(process, fastify, config, routes);
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
		for (const route of this._routes) {
			this._fastifyInstance.route(route.getOptions());
		}
	}

	async rootRouteHandler () {
		return { message: 'Hello, World' };
	}
}

module.exports = { Server };
