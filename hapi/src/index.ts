import Hapi from '@hapi/hapi';

const start = async function(): Promise<void> {
    const server: Hapi.Server = Hapi.server({
        port: 4000,
        host: '0.0.0.0'
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