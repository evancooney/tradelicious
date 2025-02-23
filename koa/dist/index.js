"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const apple_1 = __importDefault(require("./tokens/apple"));
const spotify_1 = __importDefault(require("./tokens/spotify"));
const koa_logger_1 = __importDefault(require("koa-logger"));
require("dotenv/config");
const app = new koa_1.default();
const router = new router_1.default();
router.get('/koa', (ctx, next) => {
    ctx.body = 'token town';
});
app.use((0, koa_logger_1.default)());
app.use(router.routes());
app.use(apple_1.default.routes());
app.use(spotify_1.default.routes());
app.listen(5555);
