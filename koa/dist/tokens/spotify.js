"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const router = new router_1.default();
router.use(async (ctx, next) => {
    const spotifyApi = new spotify_web_api_node_1.default({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    });
    await spotifyApi.clientCredentialsGrant().
        then(function (result) {
        console.log('It worked! Your access token is: ' + result.body.access_token);
        ctx.state.token = result.body.access_token;
    }).catch(function (err) {
        console.log('If this is printed, it probably means that you used invalid ' +
            'clientId and clientSecret values. Please check!');
        console.log('Hint: ');
        console.log(err);
    });
    await next();
});
router.get('/koa/spotify', (ctx, next) => {
    ctx.body = ctx.state.token;
});
exports.default = router;
