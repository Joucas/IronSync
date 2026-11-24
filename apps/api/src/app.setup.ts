import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { EnvironmentVariables } from './common/config/env.validation';

/**
 * HTTP-level configuration shared by `main.ts` and the e2e tests,
 * so tests exercise the same prefix, CORS and validation as the real server.
 */
export function setupApp(app: INestApplication): void {
  const config =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  // Security headers (CSP, HSTS, no-sniff, frame protection...).
  app.use(helmet());

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: config.get('FRONTEND_URL', { infer: true }),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (config.get('SWAGGER_ENABLED', { infer: true })) {
    setupSwagger(app);
  }

  // Runs onModuleDestroy hooks (e.g. closing the database pool) on SIGTERM/SIGINT.
  app.enableShutdownHooks();
}

/** OpenAPI docs: UI at /api/docs, JSON at /api/docs-json. */
function setupSwagger(app: INestApplication): void {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('IronSync API')
      .setDescription('REST API of the IronSync ERP.')
      .setVersion('0.0.1')
      .build(),
  );

  SwaggerModule.setup('api/docs', app, document);
}
