// Libraries
import pino from "pino";
import pretty from "pino-pretty";

/**
 * Logger configuration for the Gateway API.
 * This sets up a Pino logger with a stream that formats logs for better readability and includes relevant metadata.
 * The logger is configured to:
 * - `Level`: Default log level is set to `info`. Logs below this level will be ignored.
 * - `Format`: The log format is prettified for better human readability. This includes colorization, time translation, and custom message formatting.
 * - `Message Format`: Custom log messages are structured as {service} | {msg} | {code}: {method} {url} {ip}.
 * - `Serializers`: Default serializers are used for serializing error, request, and response objects into structured log entries.
 */
const stream = pretty({
  	colorize: true,
  	translateTime: 'SYS:dd-mm-yyyy HH:MM:ss.l',
  	ignore: 'pid,hostname',
  	messageFormat: '{service} | {msg} | {code}: {method} {url} {ip}',
  	hideObject: true
});

export const logger = pino({
    level: "info",
    serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res
    },
}, stream);