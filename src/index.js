'use strict';

const dotenv = require('dotenv');
const fastifyFactory = require('fastify');

const { parsed: parsedEnv } = dotenv.config();
const fastify = fastifyFactory({ logger: parsedEnv.SERVER_LOGGER });

fastify.get('/', async () => {
	return { message: 'Hello, World' };
});

async function start () {
	try {
		await fastify.listen(parsedEnv.SERVER_PORT);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

start();
