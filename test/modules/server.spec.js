'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { Server } = require('../../src/modules');
const { AsyncFunction } = require('../async-function');
const { createAsyncStubCallFake } = require('../create-async-stub-call-fake');

describe('Server', () => {
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
			close: sinon.stub(),
			listen: sinon.stub(),
			log: { error: sinon.stub() },
			route: sinon.stub(),
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

	describe('start()', () => {
		beforeEach(async () => {
			subject.init();
			await subject.start();
		});

		it('should be an async function', () => {
			expect(subject.start).to.be.an.instanceof(AsyncFunction);
		});

		it('should connect to database via the given module', async () => {
			await subject.start();

			expect(database.connect).to.have.been.called;
		});

		it('should wait for the database connection to be up', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			database.connect.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.start();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should handle errors from the database', async () => {
			const thrownError = new Error();
			database.connect.throws(thrownError);

			await subject.start();

			expect(fastifyInstance.log.error).to.have.been.calledWith(thrownError);
			expect(database.disconnect).to.have.been.called;
			expect(processModule.exit).to.have.been.calledWith(1);
		});

		it('should listen for the fastify instance with the given port', async () => {
			await subject.start();

			expect(fastifyInstance.listen).to.have.been.calledWith(config.server.port, config.server.host);
		});

		it('should wait for the fastify server to be up', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			fastifyInstance.listen.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.start();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should handle errors from the fastify instance', async () => {
			const thrownError = new Error();
			fastifyInstance.listen.throws(thrownError);

			await subject.start();

			expect(fastifyInstance.log.error).to.have.been.calledWith(thrownError);
			expect(fastifyInstance.close).to.have.been.called;
			expect(processModule.exit).to.have.been.calledWith(1);
		});
	});

	describe('stop()', () => {
		beforeEach(() => {
			subject.init();
		});

		it('should be an async function', () => {
			expect(subject.stop).to.be.an.instanceof(AsyncFunction);
		});

		it('should disconnect from the database via the given module', async () => {
			await subject.stop();

			expect(database.disconnect).to.have.been.called;
		});

		it('should wait for the database connection to be down', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			database.disconnect.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.stop();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should clost the fastify instance', async () => {
			await subject.stop();

			expect(fastifyInstance.close).to.have.been.called;
		});

		it('should wait for the fastify server to be down', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			fastifyInstance.close.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.stop();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});

		it('should exit from the application', async () => {
			await subject.stop();

			expect(processModule.exit).to.have.been.calledWith(0);
		});
	});
});
