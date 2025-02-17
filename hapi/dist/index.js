"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const start = async function () {
    const server = hapi_1.default.server({
        port: 4000,
        host: 'localhost'
    });
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello, world!';
        }
    });
    await server.start();
    console.log(`Server started on: ${server.info.uri}`);
};
start().catch(err => {
    console.error(err);
    process.exit(1);
});
