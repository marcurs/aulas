const network = require('./network');

const routes = function (server) {
	server.use('/', network);
};

module.exports = routes;
