'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { Server } = require('../src/server');

describe('Server', () => {
	let config;
	let fastifyModule;
	let fastifyInstance;
	let route;
	let routeOptions;
	let processModule;
	let routes;
	let subject;

	beforeEach(() => {
		fastifyInstance = {
			route: sinon.stub(),
			listen: sinon.stub(),
			log: { error: sinon.stub() },
		};
		processModule = { exit: sinon.stub() };
		fastifyModule = sinon.stub().returns(fastifyInstance);
		config = { server: { port: 1234, logger: true } };
		routeOptions = { method: 'PUT', url: '/test-route', handler: async () => ({ test: true }) };
		route = { getOptions: sinon.stub().returns(routeOptions) };
		routes = [route];
		subject = new Server(processModule, fastifyModule, config, routes);
	});

	describe('init()', () => {
		it('should create fastify module from the given dependency', () => {
			subject.init();

			expect(fastifyModule).to.have.been.calledWith({ logger: config.server.logger });
		});

		it('should set the given route on the fastify instance', () => {
			subject.init();

			expect(route.getOptions).to.have.been.called;

			expect(fastifyInstance.route).to.have.been.calledWith(routeOptions);
		});
	});

	describe('run()', () => {
		beforeEach(() => {
			subject.init();
		});

		it('should listen for the fastify instance with the given port', async () => {
			await subject.run();

			expect(fastifyInstance.listen).to.have.been.calledWith(config.server.port);
		});

		it('should handle errors from the fastify instance', async () => {
			const thrownError = new Error();
			fastifyInstance.listen.throws(thrownError);

			await subject.run();

			expect(fastifyInstance.log.error).to.have.been.calledWith(thrownError);
			expect(processModule.exit).to.have.been.calledWith(1);
		});
	});
});
