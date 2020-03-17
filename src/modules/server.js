'use strict';

const fastify = require('fastify');
const { Config } = require('./config');
const { Database } = require('./database');
const { RootGetRoute } = require('../routes');

class Server {
	constructor (processModule, fastifyModule, config, database, routes) {
		this._processModule = processModule;
		this._fastifyModule = fastifyModule;
		this._config = config;
		this._database = database;
		this._routes = routes;
	}

	static createDefault () {
		const config = Config.createDefault();
		const database = Database.createDefault();
		const routes = [
			RootGetRoute,
		];
		return new this(process, fastify, config, database, routes);
	}

	init () {
		const fastifyOptions = {
			logger: this._config.server.logger,
		};
		this._fastifyInstance = this._fastifyModule(fastifyOptions);

		this._initRoutes();
	}

	async start () {
		try {
			await this._database.connect();
			await this._fastifyInstance.listen(this._config.server.port, this._config.server.host);
		} catch (err) {
			this._fastifyInstance.log.error(err);
			this._processModule.exit(1);
		}
	}

	async stop () {
		await this._database.disconnect();
		await this._fastifyInstance.close();
		this._processModule.exit(0);
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
