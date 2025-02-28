
import Router from '@koa/router';
import SpotifyWebApi from 'spotify-web-api-node';
import 'dotenv/config';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const router = new Router();

router.get('/koa/spotify', async (ctx, next) => {
  //ctx.body = ctx.state.token
  await spotifyApi.clientCredentialsGrant().
    then(function (result: any) {
     console.log(result)
      ctx.body = result.body.access_token;
      return;
      
    }).catch(function (err: any) {
      console.log('If this is printed, it probably means that you used invalid ' +
        'clientId and clientSecret values. Please check!');
      console.log('Hint: ');
      console.log(err);
    });
});

export default router;