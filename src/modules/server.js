'use strict';

const fastify = require('fastify');
const { Config } = require('./config');
const { Database } = require('./database');
const {
	CategoriesGetRoute,
	CategoriesPutRoute,
	CategoriesIdDeleteRoute,
	CategoriesIdGetRoute,
	CategoriesIdPatchRoute,
	CompaniesGetRoute,
	CompaniesPutRoute,
	CompaniesIdCategoriesDeleteRoute,
	CompaniesIdCategoriesPutRoute,
	CompaniesIdDeleteRoute,
	CompaniesIdGetRoute,
	CompaniesIdPatchRoute,
	RootGetRoute,
} = require('../routes');

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
			CategoriesGetRoute.createDefault(),
			CategoriesPutRoute.createDefault(),
			CategoriesIdDeleteRoute.createDefault(),
			CategoriesIdGetRoute.createDefault(),
			CategoriesIdPatchRoute.createDefault(),
			CompaniesGetRoute.createDefault(),
			CompaniesPutRoute.createDefault(),
			CompaniesIdCategoriesDeleteRoute.createDefault(),
			CompaniesIdCategoriesPutRoute.createDefault(),
			CompaniesIdDeleteRoute.createDefault(),
			CompaniesIdGetRoute.createDefault(),
			CompaniesIdPatchRoute.createDefault(),
			RootGetRoute.createDefault(),
		];
		return new this(process, fastify, config, database, routes);
	}

	init () {
		const fastifyOptions = {
			logger: this._config.server.logger,
		};
		this._fastifyInstance = this._fastifyModule(fastifyOptions);

		this._database.init();

		this._initRoutes();
	}

	async start () {
		try {
			await this._database.connect();
			await this._fastifyInstance.listen(this._config.server.port);
		} catch (err) {
			await this._stop(1, err);
		}
	}

	async stop () {
		await this._stop(0);
	}

	_initRoutes () {
		for (const route of this._routes) {
			this._fastifyInstance.route(route.getOptions());
		}
	}

	async _stop (exitCode, err) {
		if (err) {
			this._fastifyInstance.log.error(err);
		}
		await this._database.disconnect();
		await this._fastifyInstance.close();
		this._processModule.exit(exitCode);
	}
}

module.exports = { Server };
