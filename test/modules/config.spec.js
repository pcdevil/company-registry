'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { Config } = require('../../src/modules');

describe('Config', () => {
	const envStub = {
		MONGODB_HOST: 'mongodb-test',
		MONGODB_PORT: 4567,
		MONGODB_DATABASE: 'test',

		SERVER_HOST: 'company-registry',
		SERVER_PORT: 1234,
		SERVER_LOGGER: false,
	};
	let emptyDotenv;
	let errorDotenv;
	let populatedDotenv;

	beforeEach(() => {
		emptyDotenv = { config: sinon.stub().returns({ parsed: {} }) };
		errorDotenv = { config: sinon.stub().returns({ error: new Error() }) };
		populatedDotenv = { config: sinon.stub().returns({ parsed: envStub }) };
	});

	describe('.mongodb', () => {
		it('should handle errors from the dotenv module', () => {
			const subject = new Config(errorDotenv);

			expect(subject.mongodb).to.be.an('object');
		});

		it('should have a "host" property populated by the "MONGODB_HOST" env variable', () => {
			const subject = new Config(populatedDotenv);

			expect(subject.mongodb.host).to.be.eql(envStub.MONGODB_HOST);
		});

		it('should have a "host" property with default value if the "MONGODB_HOST" env variable is unset', () => {
			const subject = new Config(emptyDotenv);

			expect(subject.mongodb.host).to.be.eql('mongodb');
		});

		it('should have a "port" property populated by the "MONGODB_PORT" env variable', () => {
			const subject = new Config(populatedDotenv);

			expect(subject.mongodb.port).to.be.eql(envStub.MONGODB_PORT);
		});

		it('should have a "port" property with default value if the "MONGODB_PORT" env variable is unset', () => {
			const subject = new Config(emptyDotenv);

			expect(subject.mongodb.port).to.be.eql(27017);
		});

		it('should have a "database" property populated by the "MONGODB_DATABASE" env variable', () => {
			const subject = new Config(populatedDotenv);

			expect(subject.mongodb.database).to.be.eql(envStub.MONGODB_DATABASE);
		});

		it('should have a "database" property with default value if the "MONGODB_DATABASE" env variable is unset', () => {
			const subject = new Config(emptyDotenv);

			expect(subject.mongodb.database).to.be.eql('company-registry');
		});
	});

	describe('.server', () => {
		it('should handle errors from the dotenv module', () => {
			const subject = new Config(errorDotenv);

			expect(subject.server).to.be.an('object');
		});

		it('should have a "host" property populated by the "SERVER_HOST" env variable', () => {
			const subject = new Config(populatedDotenv);

			expect(subject.server.host).to.be.eql(envStub.SERVER_HOST);
		});

		it('should have a "host" property with default value if the "SERVER_HOST" env variable is unset', () => {
			const subject = new Config(emptyDotenv);

			expect(subject.server.host).to.be.eql('localhost');
		});

		it('should have a "port" property populated by the "SERVER_PORT" env variable', () => {
			const subject = new Config(populatedDotenv);

			expect(subject.server.port).to.be.eql(envStub.SERVER_PORT);
		});

		it('should have a "port" property with default value if the "SERVER_PORT" env variable is unset', () => {
			const subject = new Config(emptyDotenv);

			expect(subject.server.port).to.be.eql(8080);
		});

		it('should have a "logger" property populated by the "SERVER_LOGGER" env variable', () => {
			const subject = new Config(populatedDotenv);

			expect(subject.server.logger).to.be.eql(envStub.SERVER_LOGGER);
		});

		it('should have a "logger" property with default value if the "SERVER_LOGGER" env variable is unset', () => {
			const subject = new Config(emptyDotenv);

			expect(subject.server.logger).to.be.eql(true);
		});
	});
});
