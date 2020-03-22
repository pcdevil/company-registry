'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { Database } = require('../../src/modules');
const {
	AsyncFunction,
	createAsyncStubCallFake,
} = require('../_helpers');

describe('Database', () => {
	let config;
	let mongooseModule;
	let subject;

	beforeEach(() => {
		config = { mongodb: { uri: 'mongodb://mongodb-test:4567/test' } };
		mongooseModule = {
			connect: sinon.stub(),
			disconnect: sinon.stub(),
		};
		subject = new Database(mongooseModule, config);
	});

	describe('connect()', () => {
		it('should be an async function', () => {
			expect(subject.connect).to.be.an.instanceof(AsyncFunction);
		});

		it('should call the mongoose connect when the connect method is called', () => {
			subject.connect();

			expect(mongooseModule.connect).to.have.been.calledWith(config.mongodb.uri, {
				useCreateIndex: true,
				useFindAndModify: false,
				useNewUrlParser: true,
				useUnifiedTopology: true,
				serverSelectionTimeoutMS: 5000,
			});
		});

		it('should wait for the mongoose method to be done', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			mongooseModule.connect.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.connect();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});
	});

	describe('disconnect()', () => {
		it('should be an async function', () => {
			expect(subject.disconnect).to.be.an.instanceof(AsyncFunction);
		});

		it('should call the mongoose disconnect when the disconnect method is called', () => {
			subject.disconnect();

			expect(mongooseModule.disconnect).to.have.been.called;
		});

		it('should wait for the mongoose method to be done', async () => {
			const beforeStub = sinon.stub();
			const afterStub = sinon.stub();

			mongooseModule.disconnect.callsFake(createAsyncStubCallFake(beforeStub));
			await subject.disconnect();
			afterStub();

			expect(afterStub).to.have.been.calledAfter(beforeStub);
		});
	});
});
