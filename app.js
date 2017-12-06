const Hapi = require('hapi')

const server = new Hapi.Server({ 
  host: 'localhost', 
  port: process.env.PORT  || 3000 
})

server.route(require('./routes'))

server.start();
    console.log(`Server started at ${server.info.uri}`);