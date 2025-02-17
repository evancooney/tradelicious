"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const start = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const server = hapi_1.default.server({
            port: 3000,
            host: 'localhost'
        });
        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'Hello, world!';
            }
        });
        yield server.start();
        console.log(`Server started on: ${server.info.uri}`);
    });
};
start().catch(err => {
    console.error(err);
    process.exit(1);
});
