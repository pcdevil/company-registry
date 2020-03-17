'use strict';

const { Server } = require('./modules');

const server = Server.createDefault();
server.init();
server.start();
