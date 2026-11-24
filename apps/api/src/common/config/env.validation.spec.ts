import { describe, expect, it } from 'vitest';
import { LogLevel, NodeEnv, validateEnv } from './env.validation';

const validEnv = {
  FRONTEND_URL: 'http://localhost:3000',
  DATABASE_URL: 'postgresql://user:secret@localhost:5432/postgres',
};

describe('validateEnv', () => {
  it('applies defaults for optional variables', () => {
    expect(validateEnv(validEnv)).toMatchObject({
      NODE_ENV: NodeEnv.Development,
      PORT: 3001,
      LOG_LEVEL: LogLevel.Info,
      SWAGGER_ENABLED: false,
    });
  });

  it('converts string values to their types', () => {
    const env = validateEnv({
      ...validEnv,
      PORT: '4000',
      SWAGGER_ENABLED: 'true',
    });

    expect(env.PORT).toBe(4000);
    expect(env.SWAGGER_ENABLED).toBe(true);
  });

  it('reads "false" as false', () => {
    expect(
      validateEnv({ ...validEnv, SWAGGER_ENABLED: 'false' }).SWAGGER_ENABLED,
    ).toBe(false);
  });

  it('rejects a missing FRONTEND_URL', () => {
    expect(() => validateEnv({ DATABASE_URL: validEnv.DATABASE_URL })).toThrow(
      /FRONTEND_URL/,
    );
  });

  it('rejects a non-PostgreSQL DATABASE_URL without echoing it', () => {
    const run = () =>
      validateEnv({ ...validEnv, DATABASE_URL: 'mysql://user:secret@db/app' });

    expect(run).toThrow(/DATABASE_URL/);
    expect(run).not.toThrow(/secret/);
  });
});
