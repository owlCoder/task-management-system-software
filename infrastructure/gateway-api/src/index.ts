console.clear();
import app from './app';

const port = process.env.PORT || 5000;
let isShuttingDown = false;

const server = app.listen(port, () => {
    console.log(`\x1b[32m[Gateway-API]\x1b[0m running on localhost:${port}`);
});

/**
 * Gracefully shuts down the Gateway-API server.
 * Stops accepting new connections, closes idle ones, allows in-flight requests to finish, and forces exit on timeout.
 * @param {string} signal - OS signal that triggered the shutdown (e.g. SIGINT, SIGTERM)
 */
const shutdown = (signal: string) => {
    if(isShuttingDown) return;
    isShuttingDown = true;
    
    console.log(`\x1b[31m[Gateway-API]\x1b[0m\x1b[37m: ${signal} | Shutting down...\x1b[0m`);

    server.close((err) => {
        if(err){
            console.log(`\x1b[31m[Gateway-API-Error]\x1b[0m\x1b[37m: ${err.message}\x1b[0m`);
            console.log(`\x1b[31m[Gateway-API]\x1b[0m\x1b[37m: ${signal} | Forcing shutdown...\x1b[0m`);
            process.exit(1);
        }
        process.exit(0);
    });

    if(typeof server.closeIdleConnections === 'function'){
        server.closeIdleConnections();
    }

    setTimeout(() => {
        console.log(`\x1b[31m[Gateway-API]\x1b[0m\x1b[37m: ${signal} | Forcing shutdown...\x1b[0m`);
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);