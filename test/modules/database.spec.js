'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { Database } = require('../../src/modules');

describe('Database', () => {
	let config;
	let mongooseModule;
	let subject;

	beforeEach(() => {
		config = { mongodb: { host: 'mongodb-test', port: 4567, database: 'test' } };
		mongooseModule = {
			connect: sinon.stub(),
			disconnect: sinon.stub(),
		};
		subject = new Database(mongooseModule, config);
	});

	it('should call the mongoose connect when the connect method is called', () => {
		const mongoUri = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`;

		subject.connect();

		expect(mongooseModule.connect).to.have.been.calledWith(mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	});

	it('should call the mongoose disconnect when the disconnect method is called', () => {
		subject.disconnect();

		expect(mongooseModule.disconnect).to.have.been.called;
	});
});
