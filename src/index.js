'use strict';

const fastifyFactory = require('fastify');

const fastify = fastifyFactory({ logger: true });

fastify.get('/', async () => {
	return { message: 'Hello, World' };
});

async function start () {
	try {
		await fastify.listen(3000);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

start();
