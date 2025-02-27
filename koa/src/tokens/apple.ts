import Router from '@koa/router';
// @ts-ignore 
import jwt from 'apple-music-jwt';
import 'dotenv/config';

const router = new Router();

router.use(async (ctx, next) => {
  const keyID = 'LTBSYAQ872';
  const teamID = 'Y3G7T343Y8';
  // @ts-ignore 
  const secret = Buffer.from(process.env.APPLE_SECRET)

  var token = jwt.generate(keyID, teamID, secret);
  ctx.state.token = token;
  await next();
});

router.get('/koa/apple', (ctx, next) => {
  ctx.body = ctx.state.token
});

export default router;