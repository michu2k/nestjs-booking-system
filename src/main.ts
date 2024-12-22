import {ValidationPipe, VersioningType} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";

import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1"
  });

  app.enableCors({
    origin: configService.get("CORS_ORIGINS").split(","),
    credentials: true
  });

  app.use(cookieParser());

  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle("Booking system")
    .setDescription("Booking system API documentation")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}

bootstrap();
