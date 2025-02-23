"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
// @ts-ignore 
const apple_music_jwt_1 = __importDefault(require("apple-music-jwt"));
const router = new router_1.default();
router.use(async (ctx, next) => {
    const keyID = 'LTBSYAQ872';
    const teamID = 'Y3G7T343Y8';
    // @ts-ignore 
    const secret = Buffer.from(process.env.APPLE_SECRET);
    var token = apple_music_jwt_1.default.generate(keyID, teamID, secret);
    ctx.state.token = token;
    await next();
});
router.get('/koa/apple', (ctx, next) => {
    ctx.body = ctx.state.token;
});
exports.default = router;
