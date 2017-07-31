const server = require('./http');
const socket = require('./socket');

server.listen(process.env.PORT || 3000);