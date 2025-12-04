import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
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