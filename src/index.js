'use strict';

const { Server } = require('./server');

const server = Server.createDefault();
server.init();
server.run();
