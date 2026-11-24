// Type conversion reads decorator metadata; load it even when Nest is not booted (unit tests).
import 'reflect-metadata';
import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsUrl,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
  Silent = 'silent',
}

/** Every environment variable the API reads. Document new ones in `.env.example`. */
export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3001;

  /** Web app origin allowed by CORS. */
  @IsUrl({
    require_tld: false,
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  FRONTEND_URL: string;

  @Matches(/^postgres(ql)?:\/\/.+/, {
    message: 'DATABASE_URL must be a postgresql:// connection string',
  })
  DATABASE_URL: string;

  @IsEnum(LogLevel)
  LOG_LEVEL: LogLevel = LogLevel.Info;

  // Env values are strings: "false" must become false, not Boolean("false") === true.
  @Transform(({ obj, key }: { obj: Record<string, unknown>; key: string }) =>
    [true, 'true', '1'].includes(obj[key] as string | boolean),
  )
  @IsBoolean()
  SWAGGER_ENABLED: boolean = false;
}

/**
 * Used by `ConfigModule.forRoot({ validate })`: the API refuses to start
 * with a clear message instead of failing later on a missing value.
 */
export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(env);
  if (errors.length > 0) {
    // Constraint messages name the variable, never its value (no secrets in logs).
    const details = errors
      .map((e) => `  - ${Object.values(e.constraints ?? {}).join('; ')}`)
      .join('\n');
    throw new Error(
      `Invalid environment variables (see apps/api/.env.example):\n${details}`,
    );
  }

  return env;
}
