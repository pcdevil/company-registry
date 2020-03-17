'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { Server } = require('../../src/modules');

describe('Server', () => {
	function createAsyncStubCallFake (stubCallback) {
		return async () => new Promise((resolve) => {
			setTimeout(() => {
				stubCallback();
				resolve();
			}, 1);
		});
	}

	let config;
	let database;
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
		config = { server: { host: 'company-registry', port: 1234, logger: true } };
		database = { connect: sinon.stub(), disconnect: sinon.stub() };
		routeOptions = { method: 'PUT', url: '/test-route', handler: async () => ({ test: true }) };
		route = { getOptions: sinon.stub().returns(routeOptions) };
		routes = [route];
		subject = new Server(processModule, fastifyModule, config, database, routes);
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

		it('should be an async function', () => {
			const AsyncFunction = (async () => {}).constructor;

			expect(subject.run).to.be.an.instanceof(AsyncFunction);
		});

		it('should connect to database via the given module', async () => {
			await subject.run();

			expect(database.connect).to.have.been.called;
		});

		it('should wait for the database connection to be up', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			database.connect.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.run();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should handle errors from the database', async () => {
			const thrownError = new Error();
			database.connect.throws(thrownError);

			await subject.run();

			expect(fastifyInstance.log.error).to.have.been.calledWith(thrownError);
			expect(processModule.exit).to.have.been.calledWith(1);
		});

		it('should listen for the fastify instance with the given port', async () => {
			await subject.run();

			expect(fastifyInstance.listen).to.have.been.calledWith(config.server.port, config.server.host);
		});

		it('should wait for the fastify server to be up', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			fastifyInstance.listen.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.run();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
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
