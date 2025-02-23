import Koa from 'koa';
import Router from '@koa/router';
import appleToken from './tokens/apple';
import spotifyToken from './tokens/spotify';
import logger from 'koa-logger';
import 'dotenv/config';

const app = new Koa();
const router = new Router();


  router.get('/koa', (ctx, next) => {
    ctx.body = 'token town';
  });

app.use(logger())
app.use(router.routes())
app.use(appleToken.routes());
app.use(spotifyToken.routes());
app.listen(5555);