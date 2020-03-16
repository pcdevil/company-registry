'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { Server } = require('../src/server');

describe('Server', () => {
	let config;
	let fastifyModule;
	let fastifyInstance;
	let processModule;
	let subject;

	beforeEach(() => {
		fastifyInstance = {
			get: sinon.stub(),
			listen: sinon.stub(),
			log: { error: sinon.stub() },
		};
		processModule = { exit: sinon.stub() };
		fastifyModule = sinon.stub().returns(fastifyInstance);
		config = { server: { port: 1234, logger: true } };
		subject = new Server(processModule, fastifyModule, config);
	});

	describe('init()', () => {
		it('should create fastify module from the given dependency', () => {
			subject.init();

			expect(fastifyModule).to.have.been.calledWith({ logger: config.server.logger });
		});

		it('should set a route for "/" on the fastify instance', () => {
			subject.init();

			expect(fastifyInstance.get).to.have.been.calledWith('/');
			expect(fastifyInstance.get.firstCall.lastArg).to.be.a('function');
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
