import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  	colorize: true,
  	translateTime: 'SYS:dd-mm-yyyy HH:MM:ss.l',
  	ignore: 'pid,hostname',
  	messageFormat: '{code} | {msg}',
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