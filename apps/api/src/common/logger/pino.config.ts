import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import type { Params } from 'nestjs-pino';
import {
  EnvironmentVariables,
  LogLevel,
  NodeEnv,
} from '../config/env.validation';

// Accept a caller's request id only if it is short and safe to print.
const SAFE_REQUEST_ID = /^[\w-]{1,64}$/;

/** HTTP request logging: one line per request with id, status and duration. */
export function pinoConfig(
  config: ConfigService<EnvironmentVariables, true>,
): Params {
  const nodeEnv = config.get('NODE_ENV', { infer: true });

  return {
    pinoHttp: {
      level:
        nodeEnv === NodeEnv.Test
          ? LogLevel.Silent
          : config.get('LOG_LEVEL', { infer: true }),
      // Readable lines in development, JSON everywhere else (log platforms parse it).
      transport:
        nodeEnv === NodeEnv.Development
          ? {
              target: 'pino-pretty',
              options: { singleLine: true, translateTime: 'SYS:HH:MM:ss' },
            }
          : undefined,
      genReqId: (req, res) => {
        const incoming = req.headers['x-request-id'];
        const id =
          typeof incoming === 'string' && SAFE_REQUEST_ID.test(incoming)
            ? incoming
            : randomUUID();
        res.setHeader('x-request-id', id);
        return id;
      },
      // One short line per request; headers stay out of the logs.
      serializers: {
        req: (req: { id: string; method: string; url: string }) => ({
          id: req.id,
          method: req.method,
          url: req.url,
        }),
        res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
      },
      // Defense in depth if the serializers above ever start logging headers.
      redact: [
        'req.headers.cookie',
        'req.headers.authorization',
        'res.headers["set-cookie"]',
      ],
    },
  };
}
