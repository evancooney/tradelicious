
import Router from '@koa/router';
import SpotifyWebApi from 'spotify-web-api-node';



const router = new Router();

router.use(async (ctx, next) => {

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  });

  await spotifyApi.clientCredentialsGrant().
    then(function (result: any) {
      console.log('It worked! Your access token is: ' + result.body.access_token);
      ctx.state.token = result.body.access_token;
    }).catch(function (err: any) {
      console.log('If this is printed, it probably means that you used invalid ' +
        'clientId and clientSecret values. Please check!');
      console.log('Hint: ');
      console.log(err);
    });

  await next();
});

router.get('/spotify', (ctx, next) => {
  ctx.body = ctx.state.token
});

export default router;