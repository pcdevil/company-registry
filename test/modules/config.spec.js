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
	let emptyDotenv;
	let errorDotenv;
	let populatedDotenv;

	beforeEach(() => {
		emptyDotenv = { config: sinon.stub().returns({ parsed: {} }) };
		errorDotenv = { config: sinon.stub().returns({ error: new Error() }) };
		populatedDotenv = { config: sinon.stub().returns({ parsed: envStub }) };
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

	for (const [category, properties] of Object.entries(configProperties)) {
		describe(`.${category}`, () => {
			it('should handle errors from the dotenv module', () => {
				const subject = new Config(errorDotenv);

				expect(subject[category]).to.be.an('object');
			});

			for (const { property, env, defaultValue } of properties) {
				it(`should have a "${property}" property populated by the "${env}" env variable`, () => {
					const subject = new Config(populatedDotenv);

					expect(subject[category][property]).to.be.eql(envStub[env]);
				});

				it(`should have a "${property}" property with default value if the "${env}" env variable is unset`, () => {
					const subject = new Config(emptyDotenv);

					expect(subject[category][property]).to.be.eql(defaultValue);
				});
			}
		});
	}
});
