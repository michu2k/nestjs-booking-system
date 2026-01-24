import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1"
  });

  // Credentials
  app.enableCors({
    origin: configService.get("CORS_ORIGINS").split(","),
    credentials: true
  });

  app.use(cookieParser());

  app.use(compression());

  if (process.env.NODE_ENV !== "production") {
    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle("Booking system")
      .setDescription("Booking system API documentation")
      .setVersion("1.1")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }

  const port = Number(process.env.PORT) || 3000;
  const hostname = "0.0.0.0";

  await app.listen(port, hostname);
}

bootstrap();
