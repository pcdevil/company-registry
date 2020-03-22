'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const { Config } = require('../../src/modules');

describe('Config', () => {
	const envStub = {
		MONGODB_URI: 'mongodb://mongodb-test:4567/test',

		SERVER_HOST: 'company-registry',
		SERVER_PORT: 1234,
		SERVER_LOGGER: false,
	};
	let dotenvModule;
	let processModule;

	beforeEach(() => {
		processModule = { env: {} };
		dotenvModule = { config: sinon.stub().callsFake(() => {
			processModule.env = envStub;
		}) };
	});

	const configProperties = {
		mongodb: [
			{ property: 'uri', env: 'MONGODB_URI', defaultValue: 'mongodb://mongodb:27017/company-registry' },
		],
		server: [
			{ property: 'host', env: 'SERVER_HOST', defaultValue: 'localhost' },
			{ property: 'port', env: 'SERVER_PORT', defaultValue: 8080 },
			{ property: 'logger', env: 'SERVER_LOGGER', defaultValue: true },
		],
	};

	it('should call the config method of the dotenv module upon creating new instance', () => {
		new Config(dotenvModule, processModule);

		expect(dotenvModule.config).to.have.been.called;
	});

	for (const [category, properties] of Object.entries(configProperties)) {
		describe(`.${category}`, () => {
			for (const { property, env, defaultValue } of properties) {
				it(`should have a "${property}" property populated by the "${env}" env variable`, () => {
					const subject = new Config(dotenvModule, processModule);

					expect(subject[category][property]).to.be.eql(envStub[env]);
				});

				it(`should have a "${property}" property with default value if the "${env}" env variable is unset`, () => {
					dotenvModule.config.callsFake(() => {});
					const subject = new Config(dotenvModule, processModule);

					expect(subject[category][property]).to.be.eql(defaultValue);
				});
			}
		});
	}
});
