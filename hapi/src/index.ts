import Hapi from '@hapi/hapi';
import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';
dotenv.config();

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

const start = async function(): Promise<void> {
    const server: Hapi.Server = Hapi.server({
        port: 4000,
        host: 'localhost'
    });

    spotifyApi.clientCredentialsGrant().then(
        function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
      
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
          console.log(
            'Something went wrong when retrieving an access token',
            err.message
          );
        }
      );

    server.route({
        method: 'GET',
        path: '/hapi',
        handler: (request, h) => {
            return 'Hello, world!';
        }
    });

    server.route({
        method: 'GET',
        path: '/hapi/apple',
        handler: (request, h) => {
            return 'Hello, apple!';
        }
    });

    server.route({
        method: 'GET',
        path: '/hapi/spotify',
        handler:  async (request, h) => {
            
            const res = await spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE');

             console.log(res.body) 
             return res.body;
        }
    });

    await server.start();

    console.log(`Server started on: ${server.info.uri}`);
};

start().catch(err => {
    console.error(err);
    process.exit(1);
});