'use strict';

const ConfigExports = require('./config');
const DatabaseExports = require('./database');
const ServerExports = require('./server');

module.exports = {
	...ConfigExports,
	...DatabaseExports,
	...ServerExports,
};
