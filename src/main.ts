import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('StockBuster API')
    .setDescription('API documentation for StockBuster project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // URL Swagger accessible via `/api`
  SwaggerModule.setup('api', app, document);

  // Redirection automatique de `/` vers `/api`
  app.use('/', (req, res) => {
    res.redirect('/api');
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
