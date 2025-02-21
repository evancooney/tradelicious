const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
dotenv.config();
const spotifyRoutes = require('./services/spotify/routes');


const start = async function() {

    const server = await Hapi.server({
        port: 4000,
        host: '0.0.0.0'
      }); 
    

     server.route({
        method: 'GET',
        path: '/hapi',
        handler: (request:any, h:any) => {
            return 'Hello, world!';
        }
    });

    const s = await server.route({
        method: 'GET',
        path: '/hapi/apple',
        handler: (request:any, h:any) => {
            return 'Hello, apple!';
        }
    });



      console.log(s)

      await server.route([].concat(require('./services/spotify/routes')))

    await server.start();

    console.log(`Server started on: ${server.info.uri}`);
};

start().catch(err => {
    console.error(err);
    process.exit(1);
});